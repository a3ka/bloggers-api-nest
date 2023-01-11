import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AttemptsRepository } from '../queryRepository/attemps.repository.';

const LIMIT_OF_ATTEMPTS = 10 * 1000;

@Injectable()
export class CheckLimitsIPAttemptsMiddleware implements NestMiddleware {
  constructor(protected attemptsRepository: AttemptsRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    console.log(ip);
    const url = req.url;
    const currentTime: Date = new Date();
    const limitTime: Date = new Date(currentTime.getTime() - LIMIT_OF_ATTEMPTS);

    const countOfAttempts = await this.attemptsRepository.getLastAttempts(
      ip,
      url,
      limitTime,
    );

    await this.attemptsRepository.addAttempt(ip, url, currentTime);

    if (countOfAttempts! < 5) {
      next();
    } else {
      res.sendStatus(429);
    }
  }
}
