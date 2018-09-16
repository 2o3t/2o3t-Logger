'use strict';

const path = require('path');

const LOG_DIR = exports.LOG_DIR = path.join(process.cwd(), 'logs');

exports.LOG_DEBUG_DIR = path.join(LOG_DIR, 'debug');
exports.LOG_ERROR_DIR = path.join(LOG_DIR, 'error');
exports.LOG_OTHER_DIR = path.join(LOG_DIR, 'other');
