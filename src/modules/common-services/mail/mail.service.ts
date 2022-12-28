import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService, // private configService: ConfigService, // private readonly usersRepository: UsersRepository,
  ) {}

  async sendUserConfirmation(email: string, code: string) {
    // const clientPort = this.configService.get<string>('CLIENT_PORT') || 8005;
    const clientPort = 8005;
    const url = `http://localhost:${clientPort}/client-confirm?code=${code}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Lis App! Confirm your Email',
        html: ` <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
<!--          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>-->
          <a href='http://localhost:8005/auth/registration-confirmation?code=${code}'>Click here</a> 
      </p>`,
        // template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: email,
          url,
        },
      });
    } catch (e) {
      // await this.usersRepository.deleteUnconfirmedUser(user.email);
      return null;
      // return new BadRequestException(e);
    }
    return true;
  }
}
