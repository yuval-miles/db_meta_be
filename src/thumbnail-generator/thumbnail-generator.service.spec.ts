import { Test, TestingModule } from '@nestjs/testing';
import { ThumbnailGeneratorService } from './thumbnail-generator.service';

describe('ThumbnailGeneratorService', () => {
  let service: ThumbnailGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThumbnailGeneratorService],
    }).compile();

    service = module.get<ThumbnailGeneratorService>(ThumbnailGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
