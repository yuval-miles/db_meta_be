import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ErdGeneratorService } from 'src/erd-generator/erd-generator.service';
import { ERD } from 'src/erd-generator/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { ThumbnailGeneratorService } from 'src/thumbnail-generator/thumbnail-generator.service';
import { AddDatabaseDto } from 'src/user/dtos/AddDatabaseDto';
import { DatabaseRepository } from './database.repository';
import { SelectedDBDto } from './dtos/SelectedDBDto';

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
    const erd = await this.prismaService.dBConnection.findFirst({
      where: {
        id: selectedDB.id,
        userId: user.id,
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
    if (!erd.tables.length) return await this.generateERD(selectedDB, user);
    return { tables: erd.tables, edges: erd.edges };
  }
  async generateERD(selectedDB: SelectedDBDto, user: User): Promise<object> {
    const dbConnectionInfo = await this.prismaService.dBConnection.findFirst({
      where: {
        AND: {
          userId: user.id,
          id: selectedDB.id,
        },
      },
    });
    if (!dbConnectionInfo)
      throw new BadRequestException('Cannot find database being requested');
    const databaseInfo = await this.databaseRepository.getDatabaseInfo(
      dbConnectionInfo,
    );
    const erd = await this.erdGeneratorService.generateErd(databaseInfo);
    //this.thumbnailGeneratorService.genThumbnail(erd, selectedDB, user);
    await this.saveERD(erd, selectedDB);
    return erd;
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
