# 2o3t-Logger

日志工具,可以打印日志

- 控制台输出

![控制台输出](https://raw.githubusercontent.com/2o3t/2o3t-Logger/master/captures/out.png)

- 文件输出

![文件输出](https://raw.githubusercontent.com/2o3t/2o3t-Logger/master/captures/file.png)

## Init

``` js
    const Logger = require('2o3t-logger');
    const logger = Logger.instance('names');
```

## Usage

```js
     // @example:
     logger.debug('2o3t!');
     logger.info('2o3t!');
     logger.warn('2o3t!');
     logger.error('2o3t!');
     logger.fatal('2o3t!');
     logger.system('2o3t!');
     logger.test('2o3t!');

     // 以json格式进行打印
     logger.debug.json('2o3t!');
     logger.info.json('2o3t!');
     logger.warn.json('2o3t!');
     logger.error.json('2o3t!');
     logger.fatal.json('2o3t!');
     logger.system.json('2o3t!');
     logger.test.json('2o3t!');

     // 系统内部打印
     logger.system.debug.json('2o3t!');
     logger.system.info.json('2o3t!');
     logger.system.warn.json('2o3t!');
     logger.system.error.json('2o3t!');
     logger.system.fatal.json('2o3t!');
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
    // or
    process.env.LOGGER_ROOT=NULL; // 禁用文件输出
```
