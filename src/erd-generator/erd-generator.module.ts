import { Module } from '@nestjs/common';
import { ErdGeneratorService } from './erd-generator.service';

@Module({
  providers: [ErdGeneratorService],
  exports: [ErdGeneratorService],
})
export class ErdGeneratorModule {}
