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
    pattern: '[%r] %6.6p (PID: %x{pid}) - %m%n',
    tokens: {
        pid() { return process.pid; },
    },
};
