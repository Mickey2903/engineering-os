import type { EngineeringObject } from "./EngineeringObject";

export interface EngineeringCad extends EngineeringObject {
  readonly type: "cad";

  readonly tool:
    | "kicad"
    | "solidworks"
    | "fusion360"
    | "other";

  readonly filePaths: readonly string[];

  readonly projectId?: string;

  readonly revision?: string;
}
