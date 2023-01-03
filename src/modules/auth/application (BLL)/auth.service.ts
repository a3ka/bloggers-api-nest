import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPairType, UserDBType, UsersType } from 'src/types/types';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';
import { GenerateHash } from '../../common-services/generate-hash';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
// import add from 'date-fns/add';
import { addMinutes } from 'date-fns';
import { MailService } from 'src/modules/common-services/mail/mail.service';
import { QueryRepository } from '../../../queryRepository/query.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly queryRepository: QueryRepository,
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

  async getRefreshAccessToken(
    user: any,
    rfToken: string,
  ): Promise<boolean | TokenPairType> {
    let payload;
    let userId;
    let tokenExpTime;

    if (user) {
      payload = { sub: user.id };
    }

    if (!rfToken) return false;

    if (rfToken) {
      const result: any = await this.jwtService.verify(rfToken, {
        secret: process.env.JWT_SECRET || '123',
      });
      userId = result.sub;
      tokenExpTime = result.exp;
      const blacklist = await this.queryRepository.checkRFTokenInBlacklist(
        rfToken,
      );
      if (blacklist) return false;
      if (!result) return false;
      if (!tokenExpTime) return false;

      payload = { sub: userId };
    }

    await this.queryRepository.addRFTokenToBlacklist(rfToken);

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || '123',
      // expiresIn: 10000,
      expiresIn: '10sec',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || '123',
      // expiresIn: 20000,
      expiresIn: '20sec',
    });

    const jwtTokenPair = { accessToken, refreshToken };

    return jwtTokenPair;
    // return {
    //   accessToken: this.jwtService.sign(payload),
    // };
  }

  async userRegistration(login: string, password: string, email: string) {
    const user = await this.usersRepository.findUnconfirmedUserByEmail(email);
    if (user) return false;

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
        createdAt: new Date().toISOString(),
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

    await this.mailService.sendUserConfirmation(
      email,
      newUser.emailConfirmation.confirmationCode,
    );
    await this.usersRepository.createUnconfirmedUser(newUser);
    return true;
  }

  async registrationConfirmation(confirmationCode: string): Promise<boolean> {
    const user = await this.usersRepository.findUnconfirmedUserByCode(
      confirmationCode,
    );

    if (!user) return false;

    if (new Date() > user.emailConfirmation.expirationDate) return false;

    user.accountData.isConfirmed = true;
    await this.usersRepository.createUser(user.accountData);
    await this.usersRepository.deleteUnconfirmedUser(user.accountData.email);
    return true;
  }

  async resendEmailWithConfirmCode(email: string): Promise<any> {
    const user = await this.usersRepository.findUnconfirmedUserByEmail(email);
    if (!user) return false;

    user.emailConfirmation.confirmationCode = uuidv4();
    user.emailConfirmation.expirationDate = addMinutes(new Date(), 60);

    const result = await this.mailService.sendUserConfirmation(
      email,
      user.emailConfirmation.confirmationCode,
    );

    if (result) {
      await this.usersRepository.updateUnconfirmedUser(
        user.accountData.id,
        user.emailConfirmation.confirmationCode,
        user.emailConfirmation.expirationDate,
      );
    }
    return true;
  }

  async logout(rfToken: string): Promise<boolean | TokenPairType> {
    const tokenData: any = await this.jwtService.verify(rfToken, {
      secret: process.env.JWT_SECRET || '123',
    });
    const tokenExpTime = tokenData.exp;
    const blacklist = await this.queryRepository.checkRFTokenInBlacklist(
      rfToken,
    );

    if (blacklist) return false;
    if (!tokenData) return false;
    if (!tokenExpTime) return false;

    await this.queryRepository.addRFTokenToBlacklist(rfToken);

    return true;
  }
}
