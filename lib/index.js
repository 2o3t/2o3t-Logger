'use strict';

const log4js = require('log4js');
const initLoggerDir = require('./utils').initLoggerDir;
const utility = require('2o3t-utility');
const util = require('util');

const INIT = Symbol('Logger#init');
const INIT_DIR = Symbol('Logger#initDir');
const INIT_READY = Symbol('Logger#ready');
const PARAM_CONFIG = Symbol('Logger#param#config');

// Type
const LOG_DEFAULT = Symbol('Logger#Type#default');
const LOG_ERROR = Symbol('Logger#Type#error');
const LOG_INFO = Symbol('Logger#Type#info');
const LOG_TEST = Symbol('Logger#Type#test');

// 默认配置
const defaultConfig = require('./config');

const SPLIT_CHARS = utility.strTimes('-', 64);

class Logger {

    constructor() {
        this[PARAM_CONFIG] = defaultConfig;
        this[INIT_DIR]();
        this[INIT]();
        this[INIT_READY]();
    }

    [INIT_DIR]() {
        // 配置日志相关
        initLoggerDir();
    }

    [INIT]() {
        log4js.configure(this[PARAM_CONFIG]);

        this[LOG_DEFAULT] = log4js.getLogger('default');
        this[LOG_ERROR] = log4js.getLogger('error');
        this[LOG_INFO] = log4js.getLogger('info');
        this[LOG_TEST] = log4js.getLogger('test');

        // 解析关键字
        const key = Object.keys(process.env).find(key => {
            return /^logger_allow$/i.test(key);
        });
        const inspect = process.env[key];
        if (inspect) {
            this.inspect = inspect.toLocaleLowerCase().split(',');
        }

        // 禁用列表
        const banKey = Object.keys(process.env).find(key => {
            return /^logger_ban$/i.test(key);
        });
        const ban = process.env[banKey];
        if (ban) {
            this.ban = ban.toLocaleLowerCase().split(',');
        }

    }

    [INIT_READY]() {

        // system 增强
        [ 'debug', 'info', 'warn', 'error', 'fatal' ].forEach(name => {
            const _that = this;
            this.system[name] = function() {
                if (_that.disabled('system')) return;
                const args = Array.prototype.slice.apply(arguments);
                if (args.length <= 0) {
                    args[0] = '< NULL >';
                }
                _that[LOG_TEST][name].apply(_that[LOG_TEST], args);
            };
        });

        // init json
        [ 'debug', 'info', 'warn', 'error', 'fatal', 'system', 'test' ].forEach(name => {
            const _that = this;
            this[name] && (this[name].json = function() {
                if (_that.disabled(name)) return;
                let args = Array.prototype.slice.apply(arguments);
                args = args.map(arg => {
                    if (typeof arg === 'object') {
                        return utility.formatJson(arg);
                    }
                    return arg;
                });
                if (args.length <= 0) {
                    args[0] = '< NULL >';
                }
                _that[name].apply(_that, args);
            });

            // system
            this.system[name] && (this.system[name].json = function() {
                if (_that.disabled('system')) return;
                let args = Array.prototype.slice.apply(arguments);
                args = args.map(arg => {
                    if (typeof arg === 'object') {
                        return utility.formatJson(arg);
                    }
                    return arg;
                });
                _that.system[name].apply(_that.system, args);
            });
        });

        this.debug(`Logger Inited!
        @example:
            {
                loggor.debug('2o3t!');
                loggor.info('2o3t!');
                loggor.warn('2o3t!');
                loggor.error('2o3t!');
                loggor.fatal('2o3t!');
                loggor.system('2o3t!');
                loggor.test('2o3t!');
            }`);

        // test

        // this.debug('Logger Inited!');
        // this.error('Logger Inited!');
        // this.fatal('Logger Inited!');
        // this.system('Logger Inited!');
        // this.warn('Logger Inited!');
    }

    /**
     * LOGGER_ALLOW 启用规则
     * 「*」 - 全部开启
     * 「null」 - 全部关闭
     * 其它按配置类型开启， 默认全部开启
     * -------
     * LOGGER_BAN 禁用规则
     * 「*」 - 全部禁用
     * 其它按配置类型禁用， 默认无禁用
     *
     * @param {String} name 方法名
     * @return {Boolean} 是否禁用
     * @private
     * @memberof Logger
     */
    disabled(name) {
        // first ban
        if (this.ban && this.ban.includes('*')) {
            return true;
        } else if (this.ban && this.ban.includes(name)) {
            return true;
        }
        // second
        if (!this.inspect || this.inspect.includes('*')) {
            return false;
        } else if (this.inspect.includes('null')) {
            return true;
        }
        return !this.inspect.includes(name);
    }

    get config() {
        return this[PARAM_CONFIG];
    }

    /**
     * Debug
     *
     * @param {*} message any
     * @param {*} args any
     * @memberof Logger
     */
    debug() {
        if (this.disabled('debug')) return;
        const args = Array.prototype.slice.apply(arguments);
        if (args.length <= 0) {
            args[0] = '< NULL >';
        }
        this[LOG_DEFAULT].debug.apply(this[LOG_DEFAULT], args);
    }

    /**
     * 系统记号
     *
     * @param {*} message any
     * @param {*} args any
     * @memberof Logger
     */
    system() {
        if (this.disabled('system')) return;
        const args = Array.prototype.slice.apply(arguments);
        if (args.length <= 0) {
            args[0] = '< NULL >';
        }
        this[LOG_TEST].system.apply(this[LOG_TEST], args);
    }

    test() {
        if (this.disabled('test')) return;
        const args = Array.prototype.slice.apply(arguments);
        if (args.length <= 0) {
            args[0] = '< NULL >';
        }
        let str = util.format.apply(util, args);
        let plus = `\n|${SPLIT_CHARS} `;
        plus += `\n| >>> ${utility.getCalleeFromStack(true)}`;
        plus += `\n|${SPLIT_CHARS} `;
        if (typeof args[0] === 'object') {
            if (!(toString in args[0])) {
                args[0] = Object.prototype.toString.call(args[0]);
            } else {
                args[0] = JSON.stringify(args[0]);
            }
        }
        str += plus;
        this[LOG_TEST].test.apply(this[LOG_TEST], [ str ]);
    }

    /**
     * 普通信息
     *
     * @param {*} message any
     * @param {*} args any
     * @memberof Logger
     */
    info() {
        if (this.disabled('info')) return;
        const args = Array.prototype.slice.apply(arguments);
        if (args.length <= 0) {
            args[0] = '< NULL >';
        }
        this[LOG_INFO].info.apply(this[LOG_INFO], args);
    }

    /**
     * 警告
     *
     * @param {*} message any
     * @param {*} args any
     * @memberof Logger
     */
    warn() {
        if (this.disabled('warn')) return;
        const args = Array.prototype.slice.apply(arguments);
        if (args.length <= 0) {
            args[0] = '< NULL >';
        }
        let str = util.format.apply(util, args);
        let plus = `\n|${SPLIT_CHARS} `;
        plus += `\n| >>> ${utility.getCalleeFromStack(true)}`;
        plus += `\n|${SPLIT_CHARS} `;
        if (typeof args[0] === 'object') {
            if (!(toString in args[0])) {
                args[0] = Object.prototype.toString.call(args[0]);
            } else {
                args[0] = JSON.stringify(args[0]);
            }
        }
        str += plus;
        this[LOG_INFO].warn.apply(this[LOG_INFO], [ str ]);
    }

    /**
     * 错误
     *
     * @param {*} message any
     * @param {*} args any
     * @memberof Logger
     */
    error() {
        if (this.disabled('error')) return;
        const args = Array.prototype.slice.apply(arguments);
        if (args.length <= 0) {
            args[0] = '< NULL >';
        }
        let str = util.format.apply(util, args);
        const stacks = utility.getCalleeFromStacks(true);
        if (stacks && stacks.length > 0) {
            let plus = `\n|${SPLIT_CHARS} `;
            stacks.forEach((item, index) => {
                const space = utility.strTimes('   ', index);
                plus += `\n| ${space}>>> ${item}`;
            });
            plus += `\n|${SPLIT_CHARS} `;
            if (typeof args[0] === 'object') {
                try {
                    args[0] = JSON.stringify(args[0]);
                } catch (error) {
                    args[0] = Object.prototype.toString.call(args[0]);
                }
            }
            str += plus;
        }
        this[LOG_ERROR].error.apply(this[LOG_ERROR], [ str ]);
    }

    /**
     * 致命的
     *
     * @param {*} message any
     * @param {*} args any
     * @memberof Logger
     */
    fatal() {
        if (this.disabled('fatal')) return;
        const args = Array.prototype.slice.apply(arguments);
        if (args.length <= 0) {
            args[0] = '< NULL >';
        }
        let str = util.format.apply(util, args);
        const stacks = utility.getCalleeFromStacks(true);
        if (stacks && stacks.length > 0) {
            let plus = `\n|${SPLIT_CHARS} `;
            stacks.forEach((item, index) => {
                const space = utility.strTimes('   ', index);
                plus += `\n| ${space}>>> ${item}`;
            });
            plus += `\n|${SPLIT_CHARS} `;
            if (typeof args[0] === 'object') {
                if (!(toString in args[0])) { args[0] = Object.prototype.toString.call(args[0]); }
            }
            str += plus;
        }
        this[LOG_ERROR].fatal.apply(this[LOG_ERROR], [ str ]);
    }
}

module.exports = Logger;
