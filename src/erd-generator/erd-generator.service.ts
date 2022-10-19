import { Injectable } from '@nestjs/common';
import { Relation, Columns } from 'src/database/interfaces';
import ELK from 'elkjs';
import { ERD } from './interfaces';
const elk = new ELK();

@Injectable()
export class ErdGeneratorService {
  async generateErd(columns: Columns): Promise<ERD> {
    const ERDinfo = this.formatTable(columns);
    ERDinfo.layout = await this.createLayout(ERDinfo);
    return ERDinfo;
  }
  formatTable(columns: Columns) {
    const ERDinfo: ERD = { tables: {}, edges: [], layout: null };
    for (const el of JSON.parse(JSON.stringify(columns[0]))) {
      if (el.FK) ERDinfo.edges.push(this.createEdge(el));
      if (!ERDinfo.tables[el.TABLE_NAME])
        ERDinfo.tables[el.TABLE_NAME] = [
          {
            columnName: el.COLUMN_NAME,
            dataType: el.DATA_TYPE,
            isNullable: el.IS_NULLABLE,
            charLength: el.CHARACTER_MAXIMUM_LENGTH,
            isPrimaryKey: el.PK === 'PK' ? 1 : 0,
            isForeignKey: el.FK === 'FK' ? 1 : 0,
          },
        ];
      else
        ERDinfo.tables[el.TABLE_NAME].push({
          columnName: el.COLUMN_NAME,
          dataType: el.DATA_TYPE,
          isNullable: el.IS_NULLABLE,
          charLength: el.CHARACTER_MAXIMUM_LENGTH,
          isPrimaryKey: el.PK === 'PK' ? 1 : 0,
          isForeignKey: el.FK === 'FK' ? 1 : 0,
        });
    }
    return ERDinfo;
  }
  async createLayout(erdInfo: ERD) {
    const children: { id: string; width: number; height: number }[] = [];
    for (const table in erdInfo.tables) {
      children.push({
        id: table,
        width: 424,
        height: 113.5 + erdInfo.tables[table].length * 57,
      });
    }
    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'spacing.nodeNode': '70',
        'spacing.nodeNodeBetweenLayers': '70',
      },
      children: children,
      edges: erdInfo.edges,
    };
    try {
      const layout = await elk.layout(graph);
      return layout.children;
    } catch (err) {
      console.log(err);
    }
  }
  private createEdge(el: Relation) {
    return {
      id: `${el.REFERENCED_COLUMN_NAME}_${el.REFERENCED_TABLE_NAME}=>${el.COLUMN_NAME}_${el.TABLE_NAME}`,
      sources: [`${el.REFERENCED_TABLE_NAME}`],
      targets: [`${el.TABLE_NAME}`],
      source: el.REFERENCED_TABLE_NAME,
      sourceHandle: `${el.REFERENCED_TABLE_NAME}_${el.REFERENCED_COLUMN_NAME}`,
      targetHandle: `${el.TABLE_NAME}_${el.COLUMN_NAME}`,
      target: el.TABLE_NAME,
    };
  }
}
