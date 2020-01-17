var log4js = require('log4js');
log4js.configure({
    appenders: {
        console: { type: 'console' },
        cheeseLogs: { type: 'file', filename: 'logs/cheese.log', category: 'cheese' }
    },
    categories: {

        default: { appenders: ['console', 'cheeseLogs'], level: 'info' }

    }
});

var logger = log4js.getLogger('cheese');

module.exports = logger;

/**
 * 用于express中间件，调用该方法前必须确保已经configure过
 * @returns {Function|*}
 */
module.exports.useLog = function () {
    return log4js.connectLogger(log4js.getLogger("app"), { level: log4js.levels.INFO });
}
