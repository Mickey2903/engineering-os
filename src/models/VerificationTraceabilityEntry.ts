export type VerificationTraceabilityStatus =
  | "verified"
  | "partial"
  | "missing";

export interface VerificationTraceabilityEntry {
  readonly requirementId: string;

  readonly componentIds: readonly string[];

  readonly verificationIds: readonly string[];

  readonly status: VerificationTraceabilityStatus;
}
