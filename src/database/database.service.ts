import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ErdGeneratorService } from 'src/erd-generator/erd-generator.service';
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
    return erd;
  }
}
