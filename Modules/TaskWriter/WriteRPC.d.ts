/**
 * @file WriteRPC
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import { RMQWriter } from "./RMQWriter";
import Bluebird from 'bluebird';
export declare class WriteRPC extends RMQWriter {
    queueAsserted: boolean;
    RPCTimeout: number;
    expireRemote: number;
    replyQueue: any;
    callbacks: Map<string, any>;
    constructor(config: any, channel: any);
    rpc(msg: any, options?: {
        timeout?: number;
    }): any;
    reply(msg: any, options: any): Bluebird<any>;
    initialize(): Bluebird<{
        replyQueue: any;
        taskQueue: any;
    }>;
}
