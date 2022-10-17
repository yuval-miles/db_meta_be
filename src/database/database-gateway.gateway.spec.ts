import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseGatewayGateway } from './database-gateway.gateway';

describe('DatabaseGatewayGateway', () => {
  let gateway: DatabaseGatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseGatewayGateway],
    }).compile();

    gateway = module.get<DatabaseGatewayGateway>(DatabaseGatewayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
