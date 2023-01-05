import { Controller } from '@nestjs/common';
import { SecurityService } from '../application (BLL)/security.service';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';

@Controller('auth')
export class SecurityController {
  // constructor(protected login: AuthLoginUC, protected jwtService: JwtService) {}
  constructor(
    protected usersRepository: UsersRepository,
    protected authService: SecurityService,
  ) {}
}
