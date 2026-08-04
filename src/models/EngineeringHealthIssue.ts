import type { EngineeringEntity } from "./EngineeringEntity";


export type EngineeringHealthIssueType =
  | "missing-implementation"
  | "missing-verification"
  | "missing-documentation";


export type EngineeringHealthSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";


export interface EngineeringHealthIssue {

  readonly entity:
    EngineeringEntity;


  readonly type:
    EngineeringHealthIssueType;


  readonly severity:
    EngineeringHealthSeverity;


  readonly message:
    string;

}
