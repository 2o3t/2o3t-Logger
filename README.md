# 2o3t-Logger

日志工具,可以打印日志

## Init

``` js
    const Logger = require('2o3t-logger');
    const logger = Logger.instance('names');
```

## Usage

```js
     // @example:
     loggor.debug('2o3t!');
     loggor.info('2o3t!');
     loggor.warn('2o3t!');
     loggor.error('2o3t!');
     loggor.fatal('2o3t!');
     loggor.system('2o3t!');
     loggor.test('2o3t!');

     // 以json格式进行打印
     loggor.debug.json('2o3t!');
     loggor.info.json('2o3t!');
     loggor.warn.json('2o3t!');
     loggor.error.json('2o3t!');
     loggor.fatal.json('2o3t!');
     loggor.system.json('2o3t!');
     loggor.test.json('2o3t!');

     // 系统内部打印
     loggor.system.debug.json('2o3t!');
     loggor.system.info.json('2o3t!');
     loggor.system.warn.json('2o3t!');
     loggor.system.error.json('2o3t!');
     loggor.system.fatal.json('2o3t!');
```

## 可控制输出

### For example

- 指定允许打印的模式:

```js
    process.env.LOGGER_ALLOW=*;   // 开启所有日志
    process.env.LOGGER_ALLOW=DEBUG,INFO;   // 只开启指定的日志模式
    process.env.LOGGER_ALLOW=NULL;  // 关闭所有日志
```

- 指定禁用打印的模式:

```js
    process.env.LOGGER_BAN=test; // 禁用的指定模式
    process.env.LOGGER_BAN=test,system; // 禁用的指定模式
    process.env.LOGGER_BAN=*; // 禁用所有
```

- 可指定文件存储路径进行配置(默认项目根路径):

```js
    process.env.LOGGER_ROOT=/a/b/c;   // 绝对路径
```
