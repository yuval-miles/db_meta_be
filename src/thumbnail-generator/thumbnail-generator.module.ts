import { Module } from '@nestjs/common';
import { ThumbnailGeneratorService } from './thumbnail-generator.service';

@Module({
  providers: [ThumbnailGeneratorService],
  exports: [ThumbnailGeneratorService],
})
export class ThumbnailGeneratorModule {}
