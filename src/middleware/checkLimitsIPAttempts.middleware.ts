import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AttemptsRepository } from '../queryRepository/attemps.repository.';

const LIMIT_OF_ATTEMPTS = 10 * 1000;

@Injectable()
export class CheckLimitsIPAttemptsMiddleware implements NestMiddleware {
  constructor(protected attemptsRepository: AttemptsRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const url = req.url;
    const currentTime: Date = new Date();
    const limitTime: Date = new Date(currentTime.getTime() - LIMIT_OF_ATTEMPTS);

    debugger;
    const countOfAttempts = await this.attemptsRepository.getLastAttempts(
      ip,
      url,
      limitTime,
    );

    const lastAttempt = await this.attemptsRepository.addAttempt(
      ip,
      url,
      currentTime,
    );

    debugger;
    if (countOfAttempts! < 5) {
      next();
    } else {
      throw new HttpException(
        'Too many request from one ip',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
