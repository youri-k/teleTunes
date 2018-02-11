var mail = require("./mail.js");
var cron = require('node-cron');
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs-prebuilt')
var binPath = phantomjs.path

var pdfPath = "/tmp/report.pdf";

function setupScheduler(settings,port){
    var childArgs = [ '/usr/src/app/src/pdfTest.js',
        'http://localhost:' + port + '/?print=true',
        pdfPath,
        "A4"
        ];
      
    cron.schedule(settings.getSetteing().reportCronString, function(){
        console.log('sending scheduled report');
        
        childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
            mail.sendReport(settings.getSetteing().reportRecipients,pdfPath);
        });
    });
}

module.exports = {
  setup: function(settings,port){
        mail.setup(settings).then(setupScheduler(settings, port));
  }
}
