'use strict';

const Logger = require('./lib');

const loggerMap = new Map();

/**
 * 获取一个实例
 * @param {String|Symbol} name name
 * @param {Object} opts opts
 * @return {Logger} instance
 */
Logger.instance = function(name, opts) {
    if (name) {
        if (loggerMap.has(name)) {
            return loggerMap.get(name);
        }
    }
    const log = new Logger(name, opts);
    if (name) {
        loggerMap.set(name, log);
    }
    return log;
};

Logger.hooks = function() {
    // do nothing...
};

module.exports = Logger;
