import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import puppeteer from 'puppeteer';
import { SelectedDBDto } from '../database/dtos/SelectedDBDto';
import { ERD } from '../erd-generator/interfaces';
import { User } from '../user/decorators/current-user.decorator';

@Injectable()
export class ThumbnailGeneratorService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private config: ConfigService,
  ) {}
  async genThumbnail(ERDinfo: ERD, selectedDB: SelectedDBDto, user: User) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5175');
    await page.waitForSelector('.react-flow');
    const input = await page.waitForSelector('.input');
    await input.type(JSON.stringify(ERDinfo));
    await page.click('.submit');
    const ERD = await page.$('.react-flow');
    const thumbnail = await ERD.screenshot();
    console.log(await this.uploadThumbnail(thumbnail, user.id, selectedDB.id));
    await browser.close();
  }
  private async uploadThumbnail(
    thumbnail: string | Buffer,
    userId: string,
    dbId: string,
  ) {
    return await this.s3
      .upload({
        Bucket: this.config.get('AWS_BUCKET_NAME'),
        Body: thumbnail,
        Key: `thumbnails/user${userId}db${dbId}`,
        ContentType: 'image/jpeg',
      })
      .promise();
  }
  async getThumbnail(userId: string, dbId: string): Promise<string> {
    return await this.s3.getSignedUrlPromise('getObject', {
      Key: `thumbnails/user${userId}db${dbId}`,
      Bucket: this.config.get('AWS_BUCKET_NAME'),
      Expires: 60,
    });
  }
}
