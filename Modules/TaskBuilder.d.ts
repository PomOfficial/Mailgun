/**
 * @file TaskBuilder
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
export declare class TaskBuilder {
    taskNameSet: boolean;
    notifySet: boolean;
    notifyNameSet: boolean;
    notifyQueueSet: boolean;
    constructor();
    private _notifierState;
    /**
     * Sets the task name that this builder will target.
     * @param {string} taskName - the taskname to build
     * @returns {TaskBuilder}
     */
    task(taskName: string): this;
    /**
     * Sets a taskname to notify
     * @param {string} notifierTaskName
     * @returns {TaskBuilder}
     */
    notifyTask(notifierTaskName: string): this;
    /**
     * Sets the queuename that a message should send back to.
     * @param {string} queueName -
     * @returns {TaskBuilder}
     */
    notifyQueue(queueName: any): this;
    /**
     * Adds a key-value to the payload of the task.
     * @param {string} prop
     * @param {any} val
     * @returns {TaskBuilder}
     */
    payloadProp(prop: any, val: any): this;
    /**
     * Adds a key-value to the payload of the notify task.
     * @param {string} prop
     * @param {any} val
     * @returns {TaskBuilder}
     */
    notifyProp(prop: any, val: any): this;
    /**
     * Builds your Task Object.
     * @param {string} prop - debug only, returns just this property from .payload
     * @returns {*}
     */
    build(prop: any): any;
}
