import type { VerificationCoverageEntry } from "./VerificationCoverageEntry";

export interface VerificationCoverageReport {
  readonly requirementCount: number;
  readonly verifiedRequirementCount: number;
  readonly missingVerificationCount: number;
  readonly coveragePercentage: number;
  readonly missingVerifications: readonly VerificationCoverageEntry[];
}
