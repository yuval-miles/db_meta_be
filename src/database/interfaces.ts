import * as mysql2 from 'mysql2/promise';

export interface TablesUpdateInfo {
  [key: string]: {
    x: number;
    y: number;
  };
}

export interface UpdateSessions {
  [key: string]: TablesUpdateInfo;
}

export interface Column {
  columnName: string;
  dataType: string;
  isNullable: string;
  charLength: number;
  isPrimaryKey: number;
  isForeignKey: number;
}

export type Columns = [
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

export interface SavedEdge {
  id: string;
  source: string;
  sourceHandle: string;
  targetHandle: string;
  target: string;
}

export interface SavedERD {
  tables: { [key: string]: Column[] };
  edges: SavedEdge[];
}
