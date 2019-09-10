/**
 * @file RMQWriter
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from 'bluebird';
export declare class RMQWriter {
    channel: any;
    propName: any;
    queue: any;
    type: any;
    queueOptions: any;
    msgOptions: any;
    constructor(config: any, channel: any);
    getType(): any;
    getQueueName(): any;
    rpc(msg: any, options: any): Bluebird<never>;
    writeToQueue(queuename: any, msg: any, options: any): Bluebird<any>;
    write(msg: any, options: any): Bluebird<any>;
}
