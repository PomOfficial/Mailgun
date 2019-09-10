"use strict";
/**
 * @file RMQWriter
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
class RMQWriter {
    constructor(config, channel) {
        this.channel = channel;
        this.propName = config.propName;
        this.queue = config.queueName;
        this.type = config.type;
        this.queueOptions = config.queueOptions || null;
        this.msgOptions = config.msgOptions || null;
    }
    getType() {
        return this.type;
    }
    getQueueName() {
        return this.queue;
    }
    rpc(msg, options) {
        return bluebird_1.default.reject(new Error('The .call method can only be called from a RPC enabled queue.'));
    }
    writeToQueue(queuename, msg, options) {
        return bluebird_1.default.try(() => {
            let strung = JSON.stringify(msg);
            let buf = Buffer.from(strung);
            let localOptions = options || this.msgOptions;
            return this.channel.sendToQueue(queuename, buf, localOptions);
        });
    }
    write(msg, options) {
        return this.writeToQueue(this.queue, msg, options);
    }
}
exports.RMQWriter = RMQWriter;
//# sourceMappingURL=RMQWriter.js.map