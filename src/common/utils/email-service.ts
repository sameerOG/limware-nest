export function emailService(mailservice, name, email) {
  mailservice
    .sendMail({
      to: email, // list of receivers
      from: process.env.EMAIL_USERNAME, // sender address
      subject: 'Sign Up EMail ✔', // Subject line
      html: `<html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notification Reminder</title>
      </head>
      <body>
        <div style="background-color:#f2f2f2; padding:20px;">
          <h1 style="text-align:center;">Greetings ${name}</h1>
          <p style="font-size:16px; text-align:center;">Here is your reminder notification</p>
          <hr style="border:0; border-top:1px solid #ccc;">
          <p style="font-size:14px; text-align:center; color:#999;">2022-02-09</p>
        </div>
      </body>
    </html>`, // HTML body content
    })
    .then((success) => {
      console.log('success email', success);
    })
    .catch((err) => {
      console.log('err email', err);
    });
}

export function forgotPasswordEmail(mailservice, email, code) {
  const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
  mailservice
    .sendMail({
      to: email, // list of receivers
      from: process.env.EMAIL_USERNAME, // sender address
      subject: 'Forgot Password EMail ✔', // Subject line
      html: `<html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notification Reminder</title>
      </head>
      <body>
        <div style="background-color:#f2f2f2; padding:20px;">
          <h1 style="text-align:center;">Forgot Your Password?</h1>
          <p style="font-size:16px; text-align:center;">No worries here is otp code ${code}</p>
          <hr style="border:0; border-top:1px solid #ccc;">
          <p style="font-size:14px; text-align:center; color:#999;">${today}</p>
        </div>
      </body>
    </html>`, // HTML body content
    })
    .then((success) => {
      console.log('success email', success);
    })
    .catch((err) => {
      console.log('err email', err);
    });
}

export function verifyEmailAddress(mailservice, email, code) {
  const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
  mailservice
    .sendMail({
      to: email, // list of receivers
      from: process.env.EMAIL_USERNAME, // sender address
      subject: 'Email Verification ✔', // Subject line
      html: `<html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notification Reminder</title>
      </head>
      <body>
        <div style="background-color:#f2f2f2; padding:20px;">
          <h1 style="text-align:center;">Thansk for signing up?</h1>
          <p style="font-size:16px; text-align:center;">Here is your email verification code ${code}</p>
          <hr style="border:0; border-top:1px solid #ccc;">
          <p style="font-size:14px; text-align:center; color:#999;">${today}</p>
        </div>
      </body>
    </html>`, // HTML body content
    })
    .then((success) => {
      console.log('success email', success);
    })
    .catch((err) => {
      console.log('err email', err);
    });
}

export function sendReminder(mailservice, email,username, title,description,reminder_date) {
  const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
  const reminderDate = `${new Date(reminder_date).getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`

  mailservice
    .sendMail({
      to: email, // list of receivers
      from: process.env.EMAIL_USERNAME, // sender address
      subject: 'Reminder EMail ✔', // Subject line
      html: `<html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notification Reminder</title>
      </head>
      <body>
        <div style="background-color:#f2f2f2; padding:20px;">
          <h1 style="text-align:center;">Greetings ${username}</h1>
          <p style="font-size:16px; text-align:center;">Here is your ${title} reminder set for ${reminderDate}</p>
          <p style="font-size:16px; text-align:center;">${description}</p>
          <hr style="border:0; border-top:1px solid #ccc;">
          <p style="font-size:14px; text-align:center; color:#999;">${today}</p>
        </div>
      </body>
    </html>`, // HTML body content
    })
    .then((success) => {
      console.log('success email', success);
    })
    .catch((err) => {
      console.log('err email', err);
    });
}
