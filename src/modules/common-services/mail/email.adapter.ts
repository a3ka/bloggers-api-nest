import nodemailer from 'nodemailer';
import { EMAILPASS } from '../../../constants';

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      // user: 'smtp.gmail.com',
      // port: 465,
      // secure: true,
      auth: {
        type: 'login',
        user: 'akdev6452@gmail.com', // generated ethereal user
        pass: EMAILPASS, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <akdev6451@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });

    console.log(info);
    return info;
  },
};
