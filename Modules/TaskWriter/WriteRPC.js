"use strict";
/**
 * @file WriteRPC
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RMQWriter_1 = require("./RMQWriter");
const bluebird_1 = __importDefault(require("bluebird"));
const defer_1 = require("./defer");
const uuid_1 = require("uuid");
class WriteRPC extends RMQWriter_1.RMQWriter {
    constructor(config, channel) {
        super(config, channel);
        this.queueAsserted = false;
        this.RPCTimeout = config.RPC.defaultTimeout;
        this.expireRemote = this.RPCTimeout + (this.RPCTimeout / 2);
        this.replyQueue = null;
        this.callbacks = new Map();
    }
    rpc(msg, options = {}) {
        let localOptions = {
            expiration: options.timeout ? options.timeout + (options.timeout / 2) : this.expireRemote,
            correlationId: uuid_1.v4(),
            replyTo: this.replyQueue
        };
        let deferred = defer_1.defer();
        this.callbacks.set(localOptions.correlationId, deferred);
        return this.write(msg, localOptions)
            .then(() => {
            setTimeout(() => {
                this.callbacks.delete(localOptions.correlationId);
                deferred.reject(new Error(`RPC with correlationId "${localOptions.correlationId} timed out.`));
            }, options.timeout || this.RPCTimeout);
            return deferred.promise;
        });
    }
    reply(msg, options) {
        let replyTo = options.replyTo;
        delete options.replyTo;
        return this.writeToQueue(replyTo, msg, options);
    }
    initialize() {
        return bluebird_1.default.props({
            replyQueue: this.channel.assertQueue('', { exclusive: true, autoDelete: true }),
            taskQueue: this.channel.assertQueue(this.queue, this.queueOptions)
        })
            .then((qs) => {
            this.queueAsserted = true;
            this.replyQueue = qs.replyQueue.queue;
            this.channel.consume(this.replyQueue, (msg) => {
                let correlationId = msg.properties.correlationId;
                if (this.callbacks.has(correlationId)) {
                    let p = this.callbacks.get(correlationId);
                    this.callbacks.delete(correlationId);
                    try {
                        return p.resolve(JSON.parse(msg.content.toString()));
                    }
                    catch (e) {
                        return p.reject(e);
                    }
                }
            }, { noAck: true });
            return qs;
        });
    }
}
exports.WriteRPC = WriteRPC;
//# sourceMappingURL=WriteRPC.js.map