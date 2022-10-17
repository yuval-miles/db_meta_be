import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePositionDto } from './dtos/UpdatePositionDto';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5173',
  },
})
export class DatabaseGatewayGateway {
  constructor(private prismaService: PrismaService) {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('updateNodePosition')
  handleUpdateNodePosition(@MessageBody() message: UpdatePositionDto): string {
    return 'Hello world!';
  }
}
