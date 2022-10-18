import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePositionDto } from './dtos/UpdatePositionDto';
import { TablesUpdateInfo, UpdateSessions } from './interfaces';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5173',
  },
})
export class DatabaseGateway implements OnGatewayDisconnect {
  private updateSessions: UpdateSessions = {};
  constructor(private prismaService: PrismaService) {}
  async handleDisconnect(socket: Socket) {
    const userTables = this.updateSessions[socket.id];
    if (userTables) {
      await this.updateTables(userTables);
      delete userTables[socket.id];
    }
  }
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('updateNodePosition')
  handleUpdateNodePosition(
    @MessageBody() message: UpdatePositionDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.updateSessions[socket.id] = {
      ...this.updateSessions[socket.id],
      [message.tableName]: {
        x: message.x,
        y: message.y,
        dbId: message.dbId,
      },
    };
  }
  private async updateTables(tables: TablesUpdateInfo) {
    for (const [tableName, updateInfo] of Object.entries(tables)) {
      await this.prismaService.table.update({
        where: {
          dbId_name_uninque: {
            name: tableName,
            dbId: updateInfo.dbId,
          },
        },
        data: {
          x: updateInfo.x,
          y: updateInfo.y,
        },
      });
    }
  }
}
