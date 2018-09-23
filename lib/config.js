'use strict';

const { LOG_DEBUG_DIR, LOG_ERROR_DIR, LOG_OTHER_DIR, isOpenFile } = require('./constants');

// Layout
const customStdoutLayout = require('./layout/stdout');
const customFileLayout = require('./layout/file');

const config = {
    pm2: true,
    replaceConsole: true,
    appenders: initAppenders(),
    categories: { // ALL, TRACE, DEBUG,INFO, WARN, ERROR, FATAL, MARK, OFF
        default: {
            appenders: createAppenders('debug'),
            level: 'SYSTEM',
        }, // appenders:采用的appender,取appenders项,level:设置级别
        error: {
            appenders: createAppenders('errer'),
            level: 'ERROR',
        },
        info: {
            appenders: createAppenders('info'),
            level: 'INFO',
        },
        test: {
            appenders: [ 'stdout' ],
            level: 'ALL',
        },
    },
    levels: {
        SYSTEM: { value: 1000, colour: 'grey' },
        TEST: { value: 10, colour: 'grey' },
    },
};

function initAppenders() {
    let appenders = {
        stdout: { // 控制台输出
            type: 'stdout',
            layout: customStdoutLayout,
        },
    };
    if (isOpenFile()) {
        appenders = Object.assign(appenders, {
            debug: { // 日志
                type: 'dateFile',
                filename: `${LOG_DEBUG_DIR}/`,
                pattern: 'debug-yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                maxLogSize: 1024, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
                backups: 3, // 当文件内容超过文件存储空间时，备份文件的数量
                numBackups: 5, // keep five backup files
                layout: customFileLayout,
            },
            errer: { // 错误日志
                type: 'dateFile',
                filename: `${LOG_ERROR_DIR}/`,
                pattern: 'error-yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                maxLogSize: 1024, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
                backups: 3, // 当文件内容超过文件存储空间时，备份文件的数量
                numBackups: 5, // keep five backup files
                layout: customFileLayout,
            },
            info: { // 其他日志
                type: 'dateFile',
                filename: `${LOG_OTHER_DIR}/`,
                pattern: 'other-yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                maxLogSize: 1024, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
                backups: 3, // 当文件内容超过文件存储空间时，备份文件的数量
                numBackups: 5, // keep five backup files
                layout: customFileLayout,
            },
        });
    }
    return appenders;
}

function createAppenders(name) {
    const appenders = [ 'stdout' ];
    if (name && isOpenFile()) {
        appenders.push(name);
    }
    return appenders;
}

module.exports = config;
