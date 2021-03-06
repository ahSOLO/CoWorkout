const express = require('express');
const router  = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
var handlebars = require('handlebars');

module.exports = (db) => {

  router.post("/", (req, res) => {

    const start_time = new Date(req.body.start_time);
    const start_formatted_date = start_time.getMonth() + '-' + start_time.getDate() + '-' + start_time.getFullYear();
    const start_formatted_time = start_time.toLocaleTimeString('en-US');
    const email = req.body.email;
    const first_name = req.body.first_name;

    const readHTMLFile = function(path, callback) {
      fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
          if (err) {
            throw err;
          }
          else {
            callback(null, html);
          }
      });
    };

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'coworkout.online@gmail.com',
          pass: 'coworkout192.168'
      }
    });

    readHTMLFile('routes/confirmation.html', function(err, html) {
      const template = handlebars.compile(html);
      const replacements = {
           email,
           first_name,
           start_formatted_date,
           start_formatted_time
      };
      const htmlToSend = template(replacements);
      const mailOptions = {
          from: 'coworkout.online@gmail.com',
          to: email,
          subject: "Your Workout is Confirmed!",
          html: htmlToSend
       };
       transporter.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      });
    });

  });

  return router;

};
