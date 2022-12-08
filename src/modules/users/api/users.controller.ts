import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application (BLL)/users.service';
import { CreateUserDTO } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query()
    query: {
      PageNumber: string;
      PageSize: string;
      SortBy;
      SortDirection;
      searchLoginTerm: string | null;
      searchEmailTerm: string | null;
    },
  ) {
    const users = await this.usersService.getAllUsers(
      query.PageNumber,
      query.PageSize,
      query.SortBy,
      query.SortDirection,
      query.searchLoginTerm,
      query.searchEmailTerm,
    );
    return users;
  }

  @Post()
  async createUser(
    @Body()
    { login, password, email }: CreateUserDTO,
  ) {
    return await this.usersService.createUser(login, password, email);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    const deletedUser = await this.usersService.deleteUser(userId);

    if (deletedUser) {
      return true;
    } else {
      //404
      throw new BadRequestException([
        { message: 'User with that Id was not found', field: 'userId' },
      ]);
    }
  }
}
