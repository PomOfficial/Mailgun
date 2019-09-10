/**
 * @file ActionCreator
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
/**
 * @class TaskBuilder
 * @example
 *
 * let Task = new TaskBuilder()
 *   .task('my.awesome.task)
 *   .payloadProp('level', 'Awesome')
 *   .build()
 */
export declare class ActionCreator {
    private actionNameSet;
    private stateSet;
    constructor();
    /**
     * Sets the task name that this creator will target.
     * @param {string} actionName - the actionName to build
     * @returns {TaskBuilder}
     */
    name(actionName: string): this;
    setState(val: {
        [key: string]: any;
    }): this;
    addState(prop: string, val: any): this;
    build(): {
        state: {
            [index: string]: any;
        };
        metadata: {
            name?: string;
        };
    };
}
