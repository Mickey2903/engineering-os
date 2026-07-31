import type { Requirement } from "./Requirement";

export interface TraceabilitySnapshot {
  requirementCount: number;
  tracedRequirementCount: number;
  missingComponentCount: number;
  missingVerificationCount: number;
  missingComponents: readonly Requirement[];
}
