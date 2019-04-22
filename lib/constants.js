'use strict';

const path = require('path');
const fs = require('fs');

exports.isOpenFile = function(opts = {}) {
    if (opts.disabledFile) {
        return false;
    }
    return !/^\s*null\s*$/igm.test(process.env.LOGGER_ROOT);
};

const logDirRoot = process.env.LOGGER_ROOT || process.cwd();
if (!fs.existsSync(logDirRoot) || !fs.statSync(logDirRoot).isDirectory()) {
    throw new Error(`Logger Root Dir < ${logDirRoot} > is Error !!!`);
}

const LOG_DIR = exports.LOG_DIR = path.join(logDirRoot, 'logs');

exports.LOG_DEBUG_DIR = path.join(LOG_DIR, 'debug');
exports.LOG_ERROR_DIR = path.join(LOG_DIR, 'error');
exports.LOG_OTHER_DIR = path.join(LOG_DIR, 'other');

