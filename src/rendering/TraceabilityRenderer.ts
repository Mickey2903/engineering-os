import type { TraceabilitySnapshot } from "../models/TraceabilitySnapshot";

export class TraceabilityRenderer {
  public render(snapshot: TraceabilitySnapshot): string {
    return [
      "# Traceability Report",
      "",
      `Requirements: **${String(snapshot.requirementCount)}**`,
      `Traced requirements: **${String(snapshot.tracedRequirementCount)}**`,
      `Missing components: **${String(snapshot.missingComponentCount)}**`,
      "",
    ].join("\n");
  }
}
