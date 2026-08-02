import type { EngineeringContext } from "./EngineeringContext";


export interface EngineeringContextExport {

  readonly generatedAt: number;

  readonly rootId?: string;

  readonly rootType?: string;

  readonly objects: readonly {
    id: string;
    type: string;
    title: string;
    status: string;
  }[];

}
