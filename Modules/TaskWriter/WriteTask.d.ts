/**
 * @file WriteTask
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from 'bluebird';
import { RMQWriter } from "./RMQWriter";
export declare class WriteTask extends RMQWriter {
    queueAsserted: boolean;
    constructor(config: any, channel: any);
    initialize(): Bluebird<any>;
}
