const nodemailer = require('nodemailer');

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

const sendApplicationLetter = async (email, number) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: `${email}`,
    subject: 'Заява у сервісному центрі',
    text: `Номер вашої заяви: ${number}.`,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      throw new Error(error.message);
    }
  });
}

const sendOrderLetter = async (email, number) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: `${email}`,
    subject: 'Замовлення у сервісному центрі',
    text: `Номер вашого замовлення: ${number}.`,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      throw new Error(error.message);
    }
  });
}

const sendEmployeeLetter = async (email, login, password) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: `${email}`,
    subject: 'CerviceCenterApp - реєстрація',
    text: `Вас було зареєстовано працівником сервісного центру у вебзастосунку ServiceCenterApp.
      Логін: ${login}
      Пароль: ${password}
      `,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      throw new Error(error.message);
    }
  });
}
module.exports = {
  sendApplicationLetter,
  sendOrderLetter,
  sendEmployeeLetter,
}
