"use strict";
/**
 * @file RPCReply
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const fp_1 = require("lodash/fp");
exports.RpcReply = (channel) => (msg, options) => {
    return bluebird_1.default.try(() => {
        if (!fp_1.has('correlationId', options) || fp_1.isNull(fp_1.get('correlationId', options))) {
            throw new Error('Reply metadata missing correlationId.');
        }
        if (!fp_1.has('replyTo', options) || fp_1.isNull(fp_1.get('correlationId', options))) {
            throw new Error('Reply metadata missing replyTo.');
        }
        let replyTo = options.replyTo;
        let o = { correlationId: options.correlationId };
        let strung = JSON.stringify(msg);
        let buf = Buffer.from(strung);
        return channel.sendToQueue(replyTo, buf, o);
    });
};
//# sourceMappingURL=RPCReply.js.map