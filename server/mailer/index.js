module.exports = function(to, subject, text) {
  const nodemailer = require('nodemailer');

  const service = 'SERVIDORAQUI';
  const user = 'EMAILAQUI@SERVIDORAQUI.com';
  const pass = 'SENHAQUI';

  const transporter = nodemailer.createTransport({
    service,
    auth: { user, pass }
  });

  const mailOptions = {
    from: user,
    to,
    subject,
    text
  }

  return {
    sender() {
      transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
          console.log(err);
          return;
        }
        console.log('Email enviado ' + info.response);
      })
    }
  }
}