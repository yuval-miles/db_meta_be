import { ElkNode } from 'elkjs';
import { Column } from 'src/database/interfaces';

export interface Edge {
  id: string;
  source: string;
  sources: string[];
  targets: string[];
  sourceHandle: string;
  targetHandle: string;
  target: string;
}

export interface ERD {
  tables: { [key: string]: Column[] };
  layout: ElkNode[];
  edges: Edge[];
}
