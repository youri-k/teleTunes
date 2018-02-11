var nodemailer = require("nodemailer");
var transporter;

var emailFrom;
function setup(settings) {
  return new Promise((resolve, reject) => {
    transporter = nodemailer.createTransport({
      host: settings.getSetteing().emailHost,
      port: settings.getSetteing().emailPort,
      secure: settings.getSetteing().emailSecure, // upgrade later with STARTTLS
      auth: {
        user: settings.getSetteing().emailUser,
        pass: settings.getSetteing().emailPass
      }
    });

    emailFrom = settings.getSetteing().emailFrom;

    transporter.verify(function(error, success) {
      if (error) {
        console.log("mail setup failed");
        console.log(error);
        reject(error);
      } else {
        console.log("mail setup successfull");
        resolve();
      }
    });
  });
}

function sendReport(recipiant, pathToReport) {
  let mailOptions = {
    from: emailFrom, // sender address
    to: recipiant, // list of receivers
    subject: "Automatic report", // Subject line
    text: "You can find the automated report in the atachment.", // plain text body
    attachments: [
      {
        filename: "report.pdf",
        path: pathToReport
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

module.exports = {
  sendReport: sendReport,
  setup: setup
};
