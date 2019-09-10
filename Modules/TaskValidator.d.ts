/**
 * @file TaskValidator
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
/**
 * @class TaskValidator
 * @example
 * let valid = new TaskValidator(Data)
 *  .payload(['some', 'paths'])
 *  .notify(['other', 'paths'])
 *  .validate()
 */
export declare class TaskValidator {
    /**
     * The Data object to validate
     * @param {Object} data
     */
    Errors: Error[];
    data: any;
    payloadPaths: any;
    notifyPaths: any;
    constructor(data: any);
    /**
     * Add paths required
     * @param {Array[string]} paths - Object paths
     * @returns {TaskValidator}
     */
    payload(paths: any): this;
    /**
     *
     * @param {Array[string]} paths - Object paths
     * @returns {TaskValidator}
     */
    notify(paths: any): this;
    /**
     * Validates the object under test.
     * @param {Object} logger - Pass in a logger to to when outputting errors.
     * @returns {boolean} - Does the supplied object contain the paths provided.
     */
    validate(logger: any): boolean;
}
