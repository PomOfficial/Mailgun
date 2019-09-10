"use strict";
/**
 * @file WriteTask
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const RMQWriter_1 = require("./RMQWriter");
class WriteTask extends RMQWriter_1.RMQWriter {
    constructor(config, channel) {
        super(config, channel);
        this.queueAsserted = false;
    }
    initialize() {
        return bluebird_1.default.try(() => {
            if (this.queueAsserted) {
                throw new Error('This Method has already been called.');
            }
            return this.channel.assertQueue(this.queue, this.queueOptions);
        })
            .then((q) => {
            this.queueAsserted = true;
            return q;
        });
    }
}
exports.WriteTask = WriteTask;
//# sourceMappingURL=WriteTask.js.map