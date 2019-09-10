"to strict";
/**
 * @file TaskValidator
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
/**
 * @class TaskValidator
 * @example
 * let valid = new TaskValidator(Data)
 *  .payload(['some', 'paths'])
 *  .notify(['other', 'paths'])
 *  .validate()
 */
class TaskValidator {
    constructor(data) {
        this.Errors = [];
        if (!data) {
            throw new Error('Payload arg is required.');
        }
        this.data = data;
        this.payloadPaths = null;
        this.notifyPaths = null;
    }
    /**
     * Add paths required
     * @param {Array[string]} paths - Object paths
     * @returns {TaskValidator}
     */
    payload(paths) {
        if (!fp_1.has('payload', this.data)) {
            this.Errors.push(new Error('No payload path in this object'));
        }
        this.payloadPaths = paths;
        return this;
    }
    /**
     *
     * @param {Array[string]} paths - Object paths
     * @returns {TaskValidator}
     */
    notify(paths) {
        if (!fp_1.has('notify', this.data)) {
            this.Errors.push(new Error('No notify path in this object'));
        }
        this.notifyPaths = paths;
        return this;
    }
    /**
     * Validates the object under test.
     * @param {Object} logger - Pass in a logger to to when outputting errors.
     * @returns {boolean} - Does the supplied object contain the paths provided.
     */
    validate(logger) {
        if (this.payloadPaths) {
            this.payloadPaths.forEach((v, k) => {
                if (!fp_1.has(v, this.data.payload)) {
                    this.Errors.push(new Error(`Key ${v} missing from supplied object.`));
                }
            });
        }
        if (this.notifyPaths) {
            this.notifyPaths.forEach((v, k) => {
                if (!fp_1.has(v, this.data.notify)) {
                    this.Errors.push(new Error(`Key ${v} missing from supplied object.`));
                }
            });
        }
        if (this.Errors.length && logger) {
            this.Errors.forEach((v) => {
                logger.error(v.message);
            });
        }
        return !(this.Errors.length);
    }
}
exports.TaskValidator = TaskValidator;
//# sourceMappingURL=TaskValidator.js.map