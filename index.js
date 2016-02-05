
var schedule  = require('node-schedule');
var winston   = require('winston');
var moment    = require('moment');
var mysqlDump = require('mysqldump');

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
		host: '',
		user: '',
		password: '',
		database: '',
		dest:'./dumps/gajago-' + moment().format('YYYYMMDDhhmmss') + '.sql' // destination file 
	},function(err){
		// create data.sql file; 
		log.info('dumping callback'); 
	});
};

log.info('schedule start');

var j = schedule.scheduleJob('0 0 4 * * *', function(){
  dumping();
});




