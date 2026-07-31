import type { EngineeringObject } from "./EngineeringObject";
export type RequirementPriority = "critical" | "high" | "medium" | "low" | "unknown";
export type RequirementDomain =
  | "system"
  | "power"
  | "io"
  | "communication"
  | "control"
  | "firmware"
  | "software"
  | "mechanical"
  | "safety"
  | "security"
  | "manufacturing"
  | "verification"
  | "unknown";
export type VerificationMethod =
  "analysis" | "inspection" | "demonstration" | "test" | "review" | "unknown";
export interface Requirement extends EngineeringObject {
  readonly type: "requirement";
  readonly domain: RequirementDomain;
  readonly priority: RequirementPriority;
  readonly description?: string;
  readonly rationale?: string;
  readonly acceptanceCriteria: readonly string[];
  readonly verificationMethod?: VerificationMethod;
  readonly parentId?: string;
}
