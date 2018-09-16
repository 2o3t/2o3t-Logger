'use strict';

module.exports = {
    type: 'pattern',
    // 'c': categoryName,
    // 'd': formatAsDate,
    // 'h': hostname,
    // 'm': formatMessage,
    // 'n': endOfLine,
    // 'p': logLevel,
    // 'r': startTime,
    // '[': startColour,
    // ']': endColour,
    // '%': percent,
    // 'x': userDefined
    pattern: '%[[%r] (PID: %x{pid}) %x{tag} %n[%7.8p ] %m%n%]',
    tokens: {
        pid() { return process.pid; },
        tag(loggingEvent) {
            const { level: { levelStr = '' } } = loggingEvent;
            const key = String.prototype.toLocaleLowerCase.apply(levelStr);
            let emoji;
            switch (key) {
            case 'debug':
                emoji = '🐛';
                break;
            case 'fatal':
                emoji = '🚑';
                break;
            case 'info':
                emoji = '🍀';
                break;
            case 'error':
                emoji = '🚨';
                break;
            case 'warn':
                emoji = '🙈';
                break;
            default:
                emoji = '❕';
                break;
            }
            return ` ${emoji}  `;
        },
    },
};
