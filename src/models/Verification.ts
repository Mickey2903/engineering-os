import type { EngineeringObject } from "./EngineeringObject";
import type { VerificationMethod } from "./Requirement";
export type VerificationResult =
  "not-run" | "passed" | "failed" | "blocked" | "not-applicable" | "unknown";
export interface Verification extends EngineeringObject {
  readonly type: "verification";
  readonly method: VerificationMethod;
  readonly requirementIds: readonly string[];
  readonly result: VerificationResult;
}
