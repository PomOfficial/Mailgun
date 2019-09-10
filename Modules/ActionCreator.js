"use strict";
/**
 * @file ActionCreator
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const builder = new WeakMap();
class PrivateAction {
    constructor() {
        this.metadata = {};
        this.state = {};
    }
    setName(name) {
        this.metadata.name = name;
    }
    setState(val) {
        this.state = val;
    }
    addState(prop, val) {
        this.state[prop] = val;
    }
    build() {
        return { state: this.state, metadata: this.metadata };
    }
}
const priv = (thisArg) => {
    if (!builder.has(thisArg)) {
        let p = new PrivateAction();
        builder.set(thisArg, p);
        return p;
    }
    return builder.get(thisArg);
};
/**
 * @class TaskBuilder
 * @example
 *
 * let Task = new TaskBuilder()
 *   .task('my.awesome.task)
 *   .payloadProp('level', 'Awesome')
 *   .build()
 */
class ActionCreator {
    constructor() {
        this.actionNameSet = false;
        this.stateSet = false;
        priv(this);
    }
    /**
     * Sets the task name that this creator will target.
     * @param {string} actionName - the actionName to build
     * @returns {TaskBuilder}
     */
    name(actionName) {
        if (!actionName)
            throw new Error('Requires an action name, e.g. my.awesome.task.');
        if (!fp_1.isString(actionName))
            throw new Error('actionName name must be a string.');
        let b = priv(this).setName(actionName);
        this.actionNameSet = true;
        return this;
    }
    setState(val) {
        priv(this).setState(val);
        this.stateSet = true;
        return this;
    }
    addState(prop, val) {
        priv(this).addState(prop, val);
        this.stateSet = true;
        return this;
    }
    build() {
        if (!this.actionNameSet)
            throw new Error('Action name is not set.');
        if (!this.stateSet)
            throw new Error('State has not been set for this creator');
        return priv(this).build();
    }
}
exports.ActionCreator = ActionCreator;
//# sourceMappingURL=ActionCreator.js.map