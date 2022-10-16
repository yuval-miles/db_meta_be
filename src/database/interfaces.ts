import * as mysql2 from 'mysql2/promise';

export interface Row {
  columnName: string;
  dataType: string;
  isNullable: string;
  charLength: number;
  isPrimaryKey: number;
  isForeignKey: number;
}

export type Rows = [
  (
    | mysql2.RowDataPacket[]
    | mysql2.RowDataPacket[][]
    | mysql2.OkPacket
    | mysql2.OkPacket[]
    | mysql2.ResultSetHeader
  ),
  mysql2.FieldPacket[],
];

export interface Relation {
  COLUMN_NAME: string;
  REFERENCED_COLUMN_NAME: string;
  REFERENCED_TABLE_NAME: string;
  TABLE_NAME: string;
}

export interface ERDinfo {
  tables: { [key: string]: Row[] };
  relations: Relation[];
}
