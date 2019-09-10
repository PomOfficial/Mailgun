/**
 * @file WriterFacade
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from 'bluebird';
export declare class WriterFacade {
    channel: any;
    Logger: any;
    initialized: boolean;
    qmap: Map<string, any>;
    pmap: Map<string, any>;
    constructor(queueList: any, channel: any, Logger: any);
    addWriter(config: any): this;
    initialize(): Bluebird<this>;
    to(param: string): any;
}
