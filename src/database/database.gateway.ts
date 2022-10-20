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
import { ThumbnailGeneratorService } from 'src/thumbnail-generator/thumbnail-generator.service';
import { UpdatePositionDto } from './dtos/UpdatePositionDto';
import { TablesUpdateInfo, UpdateSessions } from './interfaces';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5173',
  },
})
export class DatabaseGateway implements OnGatewayDisconnect {
  private updateSessions: UpdateSessions = {};
  constructor(
    private prismaService: PrismaService,
    private thumbnailGenService: ThumbnailGeneratorService,
  ) {}
  @WebSocketServer()
  server: Server;
  async handleDisconnect(socket: Socket) {
    await this.flushSession(socket);
  }
  @SubscribeMessage('preformUpdate')
  async preformUpdate(@ConnectedSocket() socket: Socket) {
    await this.flushSession(socket, { broadcastDone: true });
  }
  @SubscribeMessage('updateNodePosition')
  handleUpdateNodePosition(
    @MessageBody() message: UpdatePositionDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.updateSessions[socket.id] = {
      ...this.updateSessions[socket.id],
      [`${message.tableName}$$_$$${message.dbId}`]: {
        x: message.x,
        y: message.y,
      },
    };
  }
  private async flushSession(socket: Socket, opts?: { broadcastDone: true }) {
    const userTables = this.updateSessions[socket.id];
    if (userTables) {
      const dbIds = await this.updateTables(userTables);
      for (const dbId of dbIds) {
        const erd = await this.prismaService.dBConnection.findUnique({
          where: {
            id: dbId,
          },
          include: {
            tables: {
              select: {
                name: true,
                height: true,
                x: true,
                y: true,
                columns: true,
              },
            },
            edges: true,
          },
        });
        if (erd) {
          if (!opts?.broadcastDone)
            this.thumbnailGenService.genThumbnail(
              { tables: erd.tables, edges: erd.edges },
              dbId,
              erd.userId,
            );
          else {
            await this.thumbnailGenService.genThumbnail(
              { tables: erd.tables, edges: erd.edges },
              dbId,
              erd.userId,
            );
            socket.to(socket.id).emit('thumbnail-Generated');
          }
        }
      }
      delete userTables[socket.id];
    }
  }
  private async updateTables(tables: TablesUpdateInfo) {
    const dbIds: Set<string> = new Set();
    for (const [tableName, updateInfo] of Object.entries(tables)) {
      dbIds.add(tableName.split('$$_$$')[1]);
      await this.prismaService.table.update({
        where: {
          dbId_name_uninque: {
            name: tableName.split('$$_$$')[0],
            dbId: tableName.split('$$_$$')[1],
          },
        },
        data: {
          x: updateInfo.x,
          y: updateInfo.y,
        },
      });
    }
    return dbIds;
  }
}
