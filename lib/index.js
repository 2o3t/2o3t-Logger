'use strict';

const log4js = require('log4js');
const initLoggerDir = require('./utils').initLoggerDir;
const isOpenFile = require('./constants').isOpenFile;
const utility = require('2o3t-utility');
const util = require('util');

const GLOBAL_NAME = Symbol('Logger#name');

const INIT = Symbol('Logger#init');
const INIT_DIR = Symbol('Logger#initDir');
const INIT_READY = Symbol('Logger#ready');
const PARAM_CONFIG = Symbol('Logger#param#config');
const MAP_STATE = Symbol('Logger#map#state');

// Type
const LOG_DEFAULT = Symbol('Logger#Type#default');
const LOG_ERROR = Symbol('Logger#Type#error');
const LOG_INFO = Symbol('Logger#Type#info');
const LOG_TEST = Symbol('Logger#Type#test');

// 默认配置
const defaultConfig = require('./config');

const SPLIT_CHARS = utility.strTimes('-', 64);


class Logger {

    /**
     *  @example:
     * {
     *     loggor.debug('2o3t!');
     *     loggor.info('2o3t!');
     *     loggor.warn('2o3t!');
     *     loggor.error('2o3t!');
     *     loggor.fatal('2o3t!');
     *     loggor.system('2o3t!');
     *     loggor.test('2o3t!');
     *     loggor.debug.json('2o3t!');
     *     loggor.info.json('2o3t!');
     *     loggor.warn.json('2o3t!');
     *     loggor.error.json('2o3t!');
     *     loggor.fatal.json('2o3t!');
     *     loggor.system.json('2o3t!');
     *     loggor.test.json('2o3t!');
     * }
     * @param {String} name name
     */
    constructor(name) {
        this[GLOBAL_NAME] = name ? `#${name}# ` : false;
        this[PARAM_CONFIG] = defaultConfig;
        this[INIT_DIR]();
        this[INIT]();
        this[INIT_READY]();

        // 用来存放变量的
        this[MAP_STATE] = new Map();
    }

    get(name, value = null) {
        return this[MAP_STATE].get(name) || value;
    }

    set(name, value) {
        if (value === null) {
            return this[MAP_STATE].delete(name);
        }
        return this[MAP_STATE].set(name, value);
    }

    _formatJson(args) {
        args = args.map(arg => {
            if (typeof arg === 'object') {
                return utility.formatJson(arg);
            }
            return arg;
        });
        if (args.length <= 0) {
            args[0] = '< NULL >';
        } else {
            args = args.map(arg => {
                if (typeof arg === 'string') {
                    return arg.replace(/%[oj]/igm, '%s');
                }
                return arg;
            });
        }
        return args;
    }

    _injectName(args) {
        args = [ util.format(...args) ];
        if (this[GLOBAL_NAME]) {
            args.unshift(this[GLOBAL_NAME]);
        }
        return args;
    }

    [INIT_DIR]() {
        // 配置日志相关
        if (isOpenFile()) {
            initLoggerDir();
        }
    }

    [INIT]() {
        log4js.configure(this[PARAM_CONFIG]);

        this[LOG_DEFAULT] = log4js.getLogger('default');
        this[LOG_ERROR] = log4js.getLogger('error');
        this[LOG_INFO] = log4js.getLogger('info');
        this[LOG_TEST] = log4js.getLogger('test');
    }

    get _initBan() {
        // 禁用列表
        let bans = [ 'test' ]; // 默认禁用test
        const banKey = Object.keys(process.env).find(key => {
            return /^logger_ban$/i.test(key);
        });
        const ban = process.env[banKey];
        if (ban) {
            bans = ban.toLowerCase().split(',');
        }
        return bans;
    }

    get _initInspect() {
        // 解析关键字
        let inspects;
        const key = Object.keys(process.env).find(key => {
            return /^logger_allow$/i.test(key);
        });
        const inspect = process.env[key];
        if (inspect) {
            inspects = inspect.toLowerCase().split(',');
        }
        return inspects;
    }

    static get methods() {
        return [ 'debug', 'info', 'warn', 'error', 'fatal', 'system', 'test' ];
    }

    static get sysMethods() {
        return Logger.methods.filter(name => {
            return name !== 'system' && name !== 'test';
        });
    }

    [INIT_READY]() {
        const _that = this;

        // extend log
        Logger.methods.forEach(name => {

            const orgFn = this[name];
            this[name] = function() {
                if (_that.disabled(name)) return;
                let args = Array.prototype.slice.apply(arguments);
                if (args.length <= 0) {
                    args[0] = '< NULL >';
                }
                args = _that._injectName(args);
                orgFn.apply(_that, args);
            };
        });

        // system 增强
        Logger.sysMethods.forEach(name => {

            this.system[name] = function() {
                if (_that.disabled('system')) return;
                let args = Array.prototype.slice.apply(arguments);
                if (args.length <= 0) {
                    args[0] = '< NULL >';
                }
                args = _that._injectName(args);
                _that[LOG_TEST][name].apply(_that[LOG_TEST], args);
            };
        });

        // init json
        Logger.methods.forEach(name => {

            this[name] && (this[name].json = function() {
                if (_that.disabled(name)) return;
                let args = Array.prototype.slice.apply(arguments);
                args = _that._formatJson(args);
                args = _that._injectName(args);
                _that[name].apply(_that, args);
            });

            // system
            this.system[name] && (this.system[name].json = function() {
                if (_that.disabled('system')) return;
                let args = Array.prototype.slice.apply(arguments);
                args = _that._formatJson(args);
                args = _that._injectName(args);
                _that.system[name].apply(_that.system, args);
            });
        });
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
        if (this._initBan && this._initBan.includes('*')) {
            return true;
        } else if (this._initBan && this._initBan.includes(name)) {
            return true;
        }
        // second
        if (!this._initInspect || this._initInspect.includes('*')) {
            return false;
        } else if (this._initInspect.includes('null')) {
            return true;
        }
        return !this._initInspect.includes(name);
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
        const args = Array.prototype.slice.apply(arguments);
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
        const args = Array.prototype.slice.apply(arguments);
        this[LOG_TEST].system.apply(this[LOG_TEST], args);
    }

    test() {
        const args = Array.prototype.slice.apply(arguments);
        this[LOG_TEST].test.apply(this[LOG_TEST], args);
    }

    /**
     * 普通信息
     *
     * @param {*} message any
     * @param {*} args any
     * @memberof Logger
     */
    info() {
        const args = Array.prototype.slice.apply(arguments);
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
        const args = Array.prototype.slice.apply(arguments);

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
        const args = Array.prototype.slice.apply(arguments);

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
        const args = Array.prototype.slice.apply(arguments);

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
                if (!(toString in args[0])) {
                    args[0] = Object.prototype.toString.call(args[0]);
                }
            }
            str += plus;
        }
        this[LOG_ERROR].fatal.apply(this[LOG_ERROR], [ str ]);
    }
}

module.exports = Logger;
