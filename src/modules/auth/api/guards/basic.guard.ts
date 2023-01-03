import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class BasicGuards implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const input = 'Basic YWRtaW46cXdlcnR5';
    if (!request.headers || !request.headers.authorization) {
      throw new UnauthorizedException({ message: 'Invalid pass or login' });
    } else {
      if (request.headers.authorization != input) {
        throw new UnauthorizedException({ message: 'Invalid pass or login' });
      }
      return true;
    }
  }
}
