import { Test, TestingModule } from '@nestjs/testing';
import { ErdGeneratorService } from './erd-generator.service';

describe('ErdGeneratorService', () => {
  let service: ErdGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErdGeneratorService],
    }).compile();

    service = module.get<ErdGeneratorService>(ErdGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
