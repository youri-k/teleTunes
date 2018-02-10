var mail = require("./mail.js");
var cron = require('node-cron');
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs-prebuilt')
var binPath = phantomjs.path
/*
var childArgs = [
  //path.join(__dirname, 'pdfTest.js'),
  '/usr/src/app/src/pdfTest.js',
  '"http://localhost:8080/"',
  'test.pdf',
  'A4'
]*/


module.exports = {
  setup: function(settings,port){
      
      
        var childArgs = [ '/usr/src/app/src/pdfTest.js',
        'http://localhost:' + port + '/?print=true',
        "/tmp/report.pdf"
        ];
      
        cron.schedule(settings.getSetteing().reportCronString, function(){
            console.log('sending scheduled report');
            
            childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
            console.log(err);
            console.log(stdout);
            console.log(stderr);
                mail.sendReport(settings.getSetteing().reportRecipients);
            });
        });
  }
}
