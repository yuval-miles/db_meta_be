import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AddDatabaseDto } from './dtos/AddDatabaseDto';
import { UserService } from './user.service';
import { CurrentUser, User } from './decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('get-databases')
  getDatabases(@CurrentUser() user: User) {
    return this.userService.getDatabases(user);
  }
  @Post('add-database')
  async addDatabaseConnection(
    @Body() connectionInfo: AddDatabaseDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    try {
      return await this.userService.addDatabaseConnection(connectionInfo, user);
    } catch (err) {
      throw new BadRequestException('Invalid connection details');
    }
  }
}
