import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as mysql2 from 'mysql2/promise';
import { AddDatabaseDto } from 'src/user/dtos/AddDatabaseDto';
import { DBConnection } from '@prisma/client';
import { Rows } from './interfaces';

@Injectable()
export class DatabaseRepository {
  async createConnection(
    connection: AddDatabaseDto,
  ): Promise<mysql2.Connection> {
    return await mysql2.createConnection({
      host: connection.host,
      port: connection.port,
      user: connection.username,
      password: connection.password,
      database: connection.database,
    });
  }
  async testConnection(connectionInfo: AddDatabaseDto) {
    const connection = await this.createConnection(connectionInfo);
    await connection.end();
  }
  async getDatabaseInfo(connectionInfo: DBConnection): Promise<Rows> {
    const connection = await this.createConnection(connectionInfo);
    const columns = await connection.query(`
    SELECT  c.TABLE_NAME,
		        c.COLUMN_NAME,
       IF(EXISTS(select *
                 FROM information_schema.KEY_COLUMN_USAGE k
                 JOIN information_schema.TABLE_CONSTRAINTS tc 
                   ON (k.TABLE_SCHEMA=tc.TABLE_SCHEMA 
                       AND k.TABLE_NAME=tc.TABLE_NAME 
                       AND k.CONSTRAINT_NAME=tc.CONSTRAINT_NAME)
                WHERE k.TABLE_SCHEMA=c.TABLE_SCHEMA 
                      AND k.TABLE_NAME=c.TABLE_NAME 
                      AND tc.CONSTRAINT_TYPE='PRIMARY KEY' 
                      AND c.COLUMN_NAME=k.COLUMN_NAME),'PK',null) AS PK,
       IF(EXISTS(select *
                 FROM information_schema.KEY_COLUMN_USAGE k
                 JOIN information_schema.TABLE_CONSTRAINTS tc 
                   ON (k.TABLE_SCHEMA=tc.TABLE_SCHEMA 
                      AND k.TABLE_NAME=tc.TABLE_NAME 
                      AND k.CONSTRAINT_NAME=tc.CONSTRAINT_NAME)
                WHERE k.TABLE_SCHEMA=c.TABLE_SCHEMA 
                      AND k.TABLE_NAME=c.TABLE_NAME 
                      AND tc.CONSTRAINT_TYPE='UNIQUE' 
                      AND c.COLUMN_NAME=k.COLUMN_NAME),'UQ',null) AS UQ,
       IF(EXISTS(select *
                 FROM information_schema.KEY_COLUMN_USAGE k
                 JOIN information_schema.TABLE_CONSTRAINTS tc 
                   ON (k.TABLE_SCHEMA=tc.TABLE_SCHEMA 
                      AND k.TABLE_NAME=tc.TABLE_NAME 
                      AND k.CONSTRAINT_NAME=tc.CONSTRAINT_NAME)
                WHERE k.TABLE_SCHEMA=c.TABLE_SCHEMA 
                      AND k.TABLE_NAME=c.TABLE_NAME 
                      AND tc.CONSTRAINT_TYPE='FOREIGN KEY' 
                      AND c.COLUMN_NAME=k.COLUMN_NAME),'FK',null) AS FK,
      c.EXTRA,
      c.IS_NULLABLE,
      c.DATA_TYPE,
      c.COLUMN_TYPE,
      c.CHARACTER_MAXIMUM_LENGTH,
      k.REFERENCED_TABLE_NAME,
      k.REFERENCED_COLUMN_NAME
      FROM information_schema.COLUMNS c
      LEFT JOIN information_schema.KEY_COLUMN_USAGE k
      ON (k.TABLE_SCHEMA=c.TABLE_SCHEMA
      AND k.TABLE_NAME=c.TABLE_NAME
      AND k.COLUMN_NAME=c.COLUMN_NAME
      AND k.POSITION_IN_UNIQUE_CONSTRAINT IS NOT NULL)
      WHERE c.TABLE_SCHEMA='${connectionInfo.database}'
      ORDER BY c.TABLE_NAME,c.ORDINAL_POSITION;
    `);
    await connection.end();
    return columns;
  }
}
