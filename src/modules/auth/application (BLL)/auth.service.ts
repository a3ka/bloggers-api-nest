import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDBType, UsersType } from 'src/types/types';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';
import { GenerateHash } from '../../users/application (BLL)/generate-hash';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
// import add from 'date-fns/add';
import { addMinutes } from 'date-fns';
import { MailService } from 'src/modules/common-services/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashGenerator: GenerateHash,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    pass: string,
  ): Promise<boolean | UsersType> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginOrEmail,
    );

    if (!user) return false;
    const passHash = await this.hashGenerator._generateHash(
      pass,
      user.passwordSalt,
    );
    if (user.passwordHash !== passHash) {
      return false;
    }
    const {
      passwordHash,
      passwordSalt,
      createdAt,
      isConfirmed,
      ...restUserData
    } = user;
    return restUserData;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    // const accessToken = this.jwtService.sign(user);
    // return {
    //   access_token: accessToken,
    // };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async userRegistration(login: string, password: string, email: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.hashGenerator._generateHash(
      password,
      passwordSalt,
    );
    const newUser = {
      accountData: {
        id: uuidv4(),
        login,
        email,
        passwordHash,
        passwordSalt,
        createdAt: new Date(),
        isConfirmed: false,
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        // expirationDate: add(new Date(), {
        //   hours: 3,
        //   minutes: 3,
        // }),
        expirationDate: addMinutes(new Date(), 60),
      },
    };

    const emailSendResult = await this.mailService.sendUserConfirmation(
      email,
      newUser.emailConfirmation.confirmationCode,
    );
    await this.usersRepository.createUnconfirmedUser(newUser);
    return true;
  }

  async registrationConfirmation(confirmationCode: string): Promise<any> {
    const user = await this.usersRepository.findUserByConfirmCode(
      confirmationCode,
    );

    if (!user) return false;

    if (new Date() > user.emailConfirmation.expirationDate) return false;

    user.accountData.isConfirmed = true;
    await this.usersRepository.createUser(user.accountData);
    await this.usersRepository.deleteUnconfirmedUser(user.accountData.email);

    return true;

    //   const user = await this.usersRepository.registrationConfirmation(
    //     confirmationCode,
    //   );
    //
    //   if (user) {
    //     return true;
    //   } else {
    //     return false;
    //   }
  }
}
