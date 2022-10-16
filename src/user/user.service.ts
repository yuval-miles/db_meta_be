import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDatabaseDto } from './dtos/AddDatabaseDto';
import { User } from './decorators/current-user.decorator';
import { ThumbnailGeneratorService } from 'src/thumbnail-generator/thumbnail-generator.service';
import { ReturnedDatabase } from './interfaces';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private databaseService: DatabaseService,
    private thumbnailGeneratorService: ThumbnailGeneratorService,
  ) {}
  async getDatabases(user: User): Promise<ReturnedDatabase[]> {
    const databases: ReturnedDatabase[] =
      await this.prismaService.dBConnection.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          host: true,
          port: true,
          database: true,
        },
      });
    for (const database of databases) {
      const url = await this.thumbnailGeneratorService.getThumbnail(
        user.id,
        database.id,
      );
      database.thumbnail = url;
    }
    return databases;
  }
  async addDatabaseConnection(
    connectionInfo: AddDatabaseDto,
    user: User,
  ): Promise<void> {
    await this.databaseService.testConnection(connectionInfo);
    await this.prismaService.dBConnection.create({
      data: {
        host: connectionInfo.host,
        username: connectionInfo.username,
        password: connectionInfo.password,
        port: connectionInfo.port,
        database: connectionInfo.database,
        userId: user.id,
      },
    });
  }
}
