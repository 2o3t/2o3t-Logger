'use strict';

const Logger = require('./lib');

const loggerMap = new Map();

/**
 * 获取一个实例
 * @param {String|Symbol} name name
 * @return {Logger} instance
 */
Logger.instance = function(name) {
    if (name) {
        if (loggerMap.has(name)) {
            return loggerMap.get(name);
        }
    }
    const log = new Logger(name);
    if (name) {
        loggerMap.set(name, log);
    }
    return log;
};

module.exports = Logger;
