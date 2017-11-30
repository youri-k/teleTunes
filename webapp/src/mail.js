
var nodemailer = require('nodemailer');
var transporter;

console.log("mail setup");       
transporter = nodemailer.createTransport({
    host: 'posteo.de',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'jakob.braun@posteo.de',
        pass: ''
    }
});

transporter.verify(function(error, success) {
    if (error) {
            console.log(error);
    } else {
            console.log('Mail-Server is ready to take our messages');
    }
});


function sendReport(recipiant){
    let mailOptions = {
        from: 'TeleTunes <teletunes@hpi.de>', // sender address
        to: recipiant, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    }; 
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

module.exports = {
    "sendReport" : sendReport
}

