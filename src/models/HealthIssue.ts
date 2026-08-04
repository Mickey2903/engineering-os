import type { EngineeringEntity } from "./EngineeringEntity";


export type HealthIssueSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";


export type HealthIssueType =
  | "missing-implementation"
  | "missing-verification"
  | "missing-documentation"
  | "invalid-status";


export interface HealthIssue {

  readonly entity:
    EngineeringEntity;


  readonly type:
    HealthIssueType;


  readonly severity:
    HealthIssueSeverity;


  readonly message:
    string;

}
