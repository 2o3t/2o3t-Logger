export = Logger;
export as namespace Logger;

interface JsonPlus {
  /**
   * 打印JSON格式化后的日志
   * @param {string|any} args
   */
  json(...args: any);
}

interface SystemPlus extends JsonPlus {
  /**
   * 打印调试日志
   * @param {string|any} args
   */
  debug(...args: any): void;

  /**
   * 打印信息日志
   * @param {string|any} args
   */
  info(...args: any): void;

  /**
   * 打印警告日志
   * @param {string|any} args
   */
  warn(...args: any): void;

  /**
   * 打印错误日志
   * @param {string|any} args
   */
  error(...args: any): void;

  /**
   * 打印严重性错误日志
   * @param {string|any} args
   */
  fatal(...args: any): void;

  /**
   * 打印系统日志
   * @param {string|any} args
   */
  system(...args: any): void;

  /**
   * 打印测试日志
   * @param {string|any} args
   */
  test(...args: any): void;
}

declare class Logger {
  static instance(name: string): Logger;

  debug: JsonPlus;
  info: JsonPlus;
  warn: JsonPlus;
  error: JsonPlus;
  fatal: JsonPlus;
  system: SystemPlus;
  test: JsonPlus;

  /**
   * 打印调试日志
   * @param {string|any} args
   */
  debug(...args: any): void;

  /**
   * 打印信息日志
   * @param {string|any} args
   */
  info(...args: any): void;

  /**
   * 打印警告日志
   * @param {string|any} args
   */
  warn(...args: any): void;

  /**
   * 打印错误日志
   * @param {string|any} args
   */
  error(...args: any): void;

  /**
   * 打印严重性错误日志
   * @param {string|any} args
   */
  fatal(...args: any): void;

  /**
   * 打印系统日志
   * @param {string|any} args
   */
  system(...args: any): void;

  /**
   * 打印测试日志
   * @param {string|any} args
   */
  test(...args: any): void;
}
