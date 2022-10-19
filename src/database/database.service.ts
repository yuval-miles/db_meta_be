import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ErdGeneratorService } from 'src/erd-generator/erd-generator.service';
import { ERD } from 'src/erd-generator/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { ThumbnailGeneratorService } from 'src/thumbnail-generator/thumbnail-generator.service';
import { AddDatabaseDto } from 'src/user/dtos/AddDatabaseDto';
import { DatabaseRepository } from './database.repository';
import { SelectedDBDto } from './dtos/SelectedDBDto';
import { SavedERD } from './interfaces';
import { diff } from 'just-diff';

@UseGuards(JwtAuthGuard)
@Injectable()
export class DatabaseService {
  constructor(
    private databaseRepository: DatabaseRepository,
    private prismaService: PrismaService,
    private erdGeneratorService: ErdGeneratorService,
    private thumbnailGeneratorService: ThumbnailGeneratorService,
  ) {}
  async testConnection(body: AddDatabaseDto): Promise<void> {
    return await this.databaseRepository.testConnection(body);
  }
  async loadERD(selectedDB: SelectedDBDto, user: User): Promise<object> {
    const erd = await this.prismaService.dBConnection.findUnique({
      where: {
        id: selectedDB.id,
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
    if (!erd) throw new BadRequestException();
    if (erd.userId !== user.id) throw new UnauthorizedException();
    if (!erd.tables.length) return await this.generateERD(selectedDB, user);
    return { tables: erd.tables, edges: erd.edges };
  }
  async generateERD(selectedDB: SelectedDBDto, user: User): Promise<object> {
    const dbConnectionInfo = await this.prismaService.dBConnection.findUnique({
      where: {
        id: selectedDB.id,
      },
    });
    if (!dbConnectionInfo) throw new NotFoundException();
    if (dbConnectionInfo.userId !== user.id) throw new UnauthorizedException();
    const databaseInfo = await this.databaseRepository.getDatabaseInfo(
      dbConnectionInfo,
    );
    await this.prismaService.dBConnection.update({
      where: {
        id: selectedDB.id,
      },
      data: {
        jsonSchema: JSON.stringify(databaseInfo[0]),
      },
    });
    const erd = await this.erdGeneratorService.generateErd(databaseInfo);
    this.thumbnailGeneratorService.genThumbnail(erd, selectedDB, user);
    await this.saveERD(erd, selectedDB);
    return erd;
  }
  async resetDatabase(selectedDB: SelectedDBDto, user: User) {
    await this.prismaService.table.deleteMany({
      where: {
        dbId: selectedDB.id,
      },
    });
    await this.prismaService.edge.deleteMany({
      where: {
        dbId: selectedDB.id,
      },
    });
    return this.generateERD(selectedDB, user);
  }
  async compareERD(selectedDB: SelectedDBDto, user: User) {
    const dbConnectionInfo = await this.prismaService.dBConnection.findUnique({
      where: {
        id: selectedDB.id,
      },
      include: {
        tables: {
          select: {
            name: true,
            height: true,
            x: true,
            y: true,
            columns: {
              select: {
                columnName: true,
                dataType: true,
                isNullable: true,
                charLength: true,
                isPrimaryKey: true,
                isForeignKey: true,
              },
            },
          },
        },
        edges: true,
      },
    });
    if (!dbConnectionInfo) throw new NotFoundException();
    if (dbConnectionInfo.userId !== user.id) throw new UnauthorizedException();
    const currentErd: SavedERD = { tables: {}, edges: [] };
    currentErd.edges = dbConnectionInfo.edges;
    for (const table of dbConnectionInfo.tables) {
      currentErd.tables[table.name] = table.columns;
    }
    const newErd = this.erdGeneratorService.formatTable(
      await this.databaseRepository.getDatabaseInfo(dbConnectionInfo),
    );
    return diff(currentErd.tables, newErd.tables);
  }
  async saveERD(erd: ERD, selectedDB: SelectedDBDto) {
    const tableIds: { [key: string]: string } = {};
    for (const table of erd.layout) {
      const createdTable = await this.prismaService.table.create({
        data: {
          name: table.id,
          x: table.x,
          y: table.y,
          height: table.height,
          dbId: selectedDB.id,
        },
      });
      tableIds[table.id] = createdTable.id;
    }
    for (const table in erd.tables) {
      for (const row of erd.tables[table]) {
        await this.prismaService.row.create({
          data: {
            columnName: row.columnName,
            charLength: row.charLength ? row.charLength : null,
            dataType: row.dataType,
            isNullable: row.isNullable,
            isPrimaryKey: row.isPrimaryKey,
            isForeignKey: row.isForeignKey,
            tableId: tableIds[table],
          },
        });
      }
    }
    for (const edge of erd.edges) {
      await this.prismaService.edge.create({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          dbId: selectedDB.id,
        },
      });
    }
  }
}
