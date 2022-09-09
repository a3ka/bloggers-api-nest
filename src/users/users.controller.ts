import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersType } from '../types/types';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  async getAllUsers(@Query() query: { PageNumber: string; PageSize: string }) {
    const users = await this.usersService.getAllUsers(
      query.PageNumber,
      query.PageSize,
    );
    return users;
  }

  @Post()
  async createUser(@Body() { login, password, email }: UsersType) {
    const newUser = await this.usersService.createUser(login, password, email);
    return newUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    const isDeleted = await this.usersService.deleteUser(userId);
    return;
  }
}
