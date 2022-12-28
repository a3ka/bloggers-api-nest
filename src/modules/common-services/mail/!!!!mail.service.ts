import { Injectable, BadRequestException } from '@nestjs/common';
import { emailAdapter } from './email.adapter';

@Injectable()
export class MailService {
  constructor() {}

  async sendUserConfirmation(email: string, confirmationCode: string) {
    try {
      await emailAdapter.sendEmail(
        email,
        'Confirm your Email',
        ` <div> Confirm your Email: <a href='http://localhost:5000/auth/registration-confirmation?code=${confirmationCode}'>Click here</a> </div>`,
      );
    } catch (e) {
      // await this.usersRepository.deleteUnconfirmedUser(user.email);
      return null;
      // return new BadRequestException(e);
    }
    return true;
  }
  //
  //
  // async sendEmailRecoveryMessage(user: any) {
  //   await emailAdapter.sendEmail(
  //     'user.email',
  //     'password.recovery',
  //     '<div>${user.recoveryCode} message </div>',
  //   );
  // }
  //
  // async sendEmailConfirmation(email: string) {
  //   await emailAdapter.sendEmail(
  //     email,
  //     'Your Email was confirmed',
  //     ` <h3> Your Email was confirmed</h3>`,
  //   );
  // }
}
