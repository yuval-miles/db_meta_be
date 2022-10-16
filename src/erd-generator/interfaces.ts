import { ElkNode } from 'elkjs';
import { Row } from 'src/database/interfaces';

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
  tables: { [key: string]: Row[] };
  layout: ElkNode[];
  edges: Edge[];
}
