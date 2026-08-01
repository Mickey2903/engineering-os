import type { EngineeringObject } from "./EngineeringObject";

export interface EngineeringDocument extends EngineeringObject {
  readonly type: "document";

  readonly category:
    | "manual"
    | "datasheet"
    | "design"
    | "calculation"
    | "report"
    | "procedure";

  readonly filePath?: string;

  readonly projectId?: string;

  readonly revision?: string;
}
