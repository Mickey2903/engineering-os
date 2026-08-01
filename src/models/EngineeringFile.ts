import type { EngineeringObject } from "./EngineeringObject";

export interface EngineeringFile extends EngineeringObject {
  readonly type: "file";

  readonly path: string;

  readonly extension: string;

  readonly fileType:
    | "cad"
    | "document"
    | "software"
    | "data"
    | "unknown";

  readonly linkedObjectId?: string;
}

