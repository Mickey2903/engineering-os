import type { TraceabilitySnapshot } from "../models/TraceabilitySnapshot";

export class TraceabilityRenderer {
  public render(snapshot: TraceabilitySnapshot): string {
    return [
      "# Traceability Report",
      "",
      `Requirements: **${String(snapshot.requirementCount)}**`,
      `Traced requirements: **${String(snapshot.tracedRequirementCount)}**`,
      `Missing components: **${String(snapshot.missingComponentCount)}**`,
      `Missing verifications: **${String(snapshot.missingVerificationCount)}**`,
      `Missing verifications: **${String(snapshot.missingVerificationCount)}**`,
      "",
    ].join("\n");
  }
}
