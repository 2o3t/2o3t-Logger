'use strict';

const fs = require('fs');

const { LOG_DIR, LOG_DEBUG_DIR, LOG_ERROR_DIR, LOG_OTHER_DIR } = require('./constants');

exports.initLoggerDir = function() {
    try {
        if (!fs.existsSync(LOG_DIR)) { // 如果没有日志文件目录，则创建
            fs.mkdirSync(LOG_DIR);

            if (!fs.existsSync(LOG_DEBUG_DIR)) {
                console.log(LOG_DEBUG_DIR);
                fs.mkdirSync(LOG_DEBUG_DIR);
            }

            if (!fs.existsSync(LOG_ERROR_DIR)) {
                console.log(LOG_ERROR_DIR);
                fs.mkdirSync(LOG_ERROR_DIR);
            }

            if (!fs.existsSync(LOG_OTHER_DIR)) {
                console.log(LOG_OTHER_DIR);
                fs.mkdirSync(LOG_OTHER_DIR);
            }
        }
    } catch (error) {
        throw new Error(error);
    }
};
