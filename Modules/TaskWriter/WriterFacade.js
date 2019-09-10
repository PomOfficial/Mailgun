"use strict";
/**
 * @file WriterFacade
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const WriteRPC_1 = require("./WriteRPC");
const WriteTask_1 = require("./WriteTask");
const fp_1 = require("lodash/fp");
const WeakWriters = new WeakMap();
function deferErrorToPromise(param) {
    return () => {
        return bluebird_1.default.reject(new Error(`Parameter or queuename "${param}" not found in DispatchAction.to('${param}').`));
    };
}
class WriterFacade {
    constructor(queueList, channel, Logger) {
        this.channel = channel;
        this.Logger = Logger;
        this.initialized = false;
        this.qmap = new Map(); //keyed by queuename
        this.pmap = new Map(); //keyed by config propName
        fp_1.each((q) => {
            if (this.qmap.has(q.queueName)) {
                throw new Error(`Duplicate Queuename "${q.queueName}" in AddTask queues configuration.`);
            }
            if (this.pmap.has(q.propName)) {
                throw new Error(`Duplicate PropName "${q.propName}" in AddTask queues configuration.`);
            }
            this.qmap.set(q.queueName, q);
            this.pmap.set(q.propName, q);
            this.addWriter(q);
        }, queueList);
    }
    addWriter(config) {
        let writer;
        if (!fp_1.has('queueName', config) || !fp_1.has('propName', config) || !fp_1.has('type', config)) {
            throw new Error('Provided config must include propName, queueName and type.');
        }
        if (config.RPC.enabled) {
            writer = new WriteRPC_1.WriteRPC(config, this.channel);
            this.Logger.log(`Queue: '${writer.queue}', Param: '${writer.propName}', loading. RPC: enabled`);
        }
        else {
            writer = new WriteTask_1.WriteTask(config, this.channel);
            this.Logger.log(`Queue: '${writer.queue}', Param: '${writer.propName}', loading. RPC: disabled`);
        }
        WeakWriters.set(config, writer);
        return this;
    }
    initialize() {
        return bluebird_1.default
            .map(this.pmap.values(), (c) => {
            return WeakWriters.get(c);
        })
            .filter((w) => {
            return !w.queueAsserted;
        })
            .map((w) => {
            this.Logger.log(`Asserting queue - '${w.queue}' on param '${w.propName}'.`);
            return w.initialize();
        })
            .then((w) => {
            fp_1.each((l) => {
                if (fp_1.isObject(l.taskQueue)) {
                    this.Logger.log(`Queue - '${l.taskQueue.queue}' ready for messages.`);
                    this.Logger.log(`RPC Queue - '${l.replyQueue.queue}' listening for replies.`);
                    return;
                }
                this.Logger.log(`Queue - '${l.queue}' ready for messages.`);
            }, w);
            return this;
        });
    }
    to(param) {
        if (this.pmap.has(param)) {
            return WeakWriters.get(this.pmap.get(param));
        }
        if (this.qmap.has(param)) {
            return WeakWriters.get(this.qmap.get(param));
        }
        let detp = deferErrorToPromise(param);
        return {
            call: detp,
            write: detp
        };
    }
}
exports.WriterFacade = WriterFacade;
//# sourceMappingURL=WriterFacade.js.map