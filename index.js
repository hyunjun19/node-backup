
var fs = require('fs');
var schedule  = require('node-schedule');
var winston   = require('winston');
var moment    = require('moment');
var mysqlDump = require('mysqldump');

var dumpPath = './dumps';
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return moment().format('YYYY-MM-DD hh:mm:ss');
      },
      formatter: function(options) {
        // Return string will be passed to logger. 
        return '[' + options.timestamp() + '] ' + options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ]
});

var dumping = function(){
	mysqlDump({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'gajago_local',
		dest: dumpPath + '/gajago-' + moment().format('YYYYMMDDhhmmss') + '.sql' // destination file 
	},function(err){
		// create data.sql file; 
		log.info('dumping callback'); 
	});
};

if (!fs.existsSync(dumpPath)) fs.mkdirSync(dumpPath);	

log.info('schedule start');

var j = schedule.scheduleJob('0 0 4 * * *', function(){
  dumping();
});




