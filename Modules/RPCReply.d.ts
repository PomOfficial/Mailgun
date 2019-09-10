/**
 * @file RPCReply
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from 'bluebird';
export declare const RpcReply: (channel: any) => (msg: any, options: any) => Bluebird<any>;
