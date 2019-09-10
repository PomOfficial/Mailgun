/**
 * @file defer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import Bluebird from 'bluebird';
export declare const defer: () => {
    resolve: any;
    reject: any;
    promise: Bluebird<unknown>;
};
