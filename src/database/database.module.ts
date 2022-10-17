import { Module } from '@nestjs/common';
import { DatabaseRepository } from './database.repository';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { ErdGeneratorModule } from '../erd-generator/erd-generator.module';
import { ThumbnailGeneratorModule } from '../thumbnail-generator/thumbnail-generator.module';
import { DatabaseGatewayGateway } from './database-gateway.gateway';

@Module({
  providers: [DatabaseService, DatabaseRepository, DatabaseGatewayGateway],
  exports: [DatabaseService],
  controllers: [DatabaseController],
  imports: [ErdGeneratorModule, ThumbnailGeneratorModule],
})
export class DatabaseModule {}
