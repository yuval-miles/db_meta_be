import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ThumbnailGeneratorModule } from 'src/thumbnail-generator/thumbnail-generator.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [DatabaseModule, ThumbnailGeneratorModule],
})
export class UserModule {}
