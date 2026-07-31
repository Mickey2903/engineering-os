import type { EngineeringObject } from "./EngineeringObject";
export type AdrStatus =
  "proposed" | "accepted" | "rejected" | "superseded" | "deprecated" | "unknown";
export interface Adr extends EngineeringObject {
  readonly type: "adr";
  readonly decisionStatus: AdrStatus;
  readonly context?: string;
  readonly decision?: string;
  readonly consequences: readonly string[];
  readonly supersedesId?: string;
}
