import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ErdGeneratorModule } from './erd-generator/erd-generator.module';
import { ThumbnailGeneratorModule } from './thumbnail-generator/thumbnail-generator.module';
import { S3Module } from 'nestjs-s3';

@Module({
  imports: [
    DatabaseModule,
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          accessKeyId: config.get('AWS_ACCESS_KEY'),
          secretAccessKey: config.get('AWS_SECRET_KEY'),
          region: config.get('AWS_BUCKET_REGION'),
          signatureVersion: 'v4',
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ErdGeneratorModule,
    ThumbnailGeneratorModule,
  ],
})
export class AppModule {}
