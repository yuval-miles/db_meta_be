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
  @Post('load-erd')
  loadERD(@Body() selectedDB: SelectedDBDto, @CurrentUser() user: User) {
    return this.databaseService.loadERD(selectedDB, user);
  }
  @Post('generate-erd')
  generateERD(@Body() selectedDB: SelectedDBDto, @CurrentUser() user: User) {
    return this.databaseService.generateERD(selectedDB, user);
  }
  @Post('reset-erd')
  resetERD(@Body() selectedDB: SelectedDBDto, @CurrentUser() user: User) {
    return this.databaseService.resetDatabase(selectedDB, user);
  }
  @Post('compare-erd')
  compareERD(@Body() selectedDB: SelectedDBDto, @CurrentUser() user: User) {
    return this.databaseService.compareERD(selectedDB, user);
  }
}
