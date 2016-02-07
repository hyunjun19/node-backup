var fs        = require('fs');
var schedule  = require('node-schedule');
var winston   = require('winston');
var moment    = require('moment');
var mysqlDump = require('mysqldump');
var request   = require('request');

var dumpPath = './dumps';

var log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function() {
                return moment().format('YYYY-MM-DD hh:mm:ss');
            },
            formatter: function(options) {
                // Return string will be passed to logger. 
                return '[' + options.timestamp() + '] ' + options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n    '+ JSON.stringify(options.meta) : '' );
            }
        })
    ]
});

var dumping = function(){
    var destFile = 'gajago-' + moment().format('YYYYMMDDhhmmss') + '.sql';
    mysqlDump({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '',
        dest: dumpPath + '/' + destFile
    },function(error){
        if (error) {
            requestJandiWebHook(error);
        } else {
            requestJandiWebHook(destFile + ' file created ~ !');
        }
    });
};

var requestJandiWebHook = function(message){
    log.info('call requestJandiWebHook');

    request.post(
        {
            url: 'https://wh.jandi.com/connect-api/webhook/',
            form: {
                body: 'MySql dump complete.',
                connectColor: '#FAC11B',
                connectInfo: [{
                    title: 'MySql dump complete',
                    description: message
                }]
            }
        },
        function(error, response, body){
            log.info('success requestJandiWebHook', error, response, body);
        }
    );
};

if (!fs.existsSync(dumpPath)) fs.mkdirSync(dumpPath);    

log.info('schedule start');

schedule.scheduleJob('0 0 4 * * *', function(){
    dumping();
});








