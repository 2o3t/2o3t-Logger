declare class Logger {
    static instance(name: string): Logger;
    // 外部重写
    static hook(name: string, args: object): void;

    debug: Logger.Debug;
    info: Logger.Info;
    warn: Logger.Warn;
    error: Logger.Error;
    fatal: Logger.Fatal;
    system: Logger.System;
    test: Logger.Test;
  }

  declare namespace Logger {
    interface JsonPlus {
      /**
       * 打印JSON格式化后的日志
       * @param {string|any} args
       */
      json(...args: Array<any>): void;
    }

    interface SystemPlus extends Logger.JsonPlus {
      debug: Logger.Debug;
      info: Logger.Info;
      warn: Logger.Warn;
      error: Logger.Error;
      fatal: Logger.Fatal;
    }

    interface Debug extends JsonPlus {
      /**
       * 打印调试日志
       * @param {string|any} args
       */
      (...args: Array<any>): void;
    }

    interface Info extends JsonPlus {
      /**
       * 打印信息日志
       * @param {string|any} args
       */
      (...args: Array<any>): void;
    }

    interface Warn extends JsonPlus {
      /**
       * 打印警告日志
       * @param {string|any} args
       */
      (...args: Array<any>): void;
    }

    interface Error extends JsonPlus {
      /**
       * 打印错误日志
       * @param {string|any} args
       */
      (...args: Array<any>): void;
    }

    interface Fatal extends JsonPlus {
      /**
       * 打印严重性错误日志
       * @param {string|any} args
       */
      (...args: Array<any>): void;
    }

    interface System extends SystemPlus {
      /**
       * 打印系统日志
       * @param {string|any} args
       */
      (...args: Array<any>): void;
    }

    interface Test extends JsonPlus {
      /**
       * 打印测试日志
       * @param {string|any} args
       */
      (...args: Array<any>): void;
    }

  }

  export = Logger;
