import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { DatabaseService } from './database.service';
import { SelectedDBDto } from './dtos/SelectedDBDto';

@UseGuards(JwtAuthGuard)
@Controller('database')
export class DatabaseController {
  constructor(private databaseService: DatabaseService) {}
  @Post('generate-erd')
  generateERD(@Body() selectedDB: SelectedDBDto, @CurrentUser() user: User) {
    return this.databaseService.generateERD(selectedDB, user);
  }
}
