import type { TraceabilitySnapshot } from "../models/TraceabilitySnapshot";

export class TraceabilityRenderer {
  private renderHeading(): string {
    return "# Traceability Report";
  }

  private renderCoverage(snapshot: TraceabilitySnapshot): string {
    const coverage =
      snapshot.requirementCount === 0
        ? 0
        : Math.round((snapshot.tracedRequirementCount / snapshot.requirementCount) * 100);

    return `Coverage: **${String(coverage)}%**`;
  }

  public render(snapshot: TraceabilitySnapshot): string {
    return [
      this.renderHeading(),
      "",
      `Requirements: **${String(snapshot.requirementCount)}**`,
      `Traced requirements: **${String(snapshot.tracedRequirementCount)}**`,
      `Missing components: **${String(snapshot.missingComponentCount)}**`,
      `Missing verifications: **${String(snapshot.missingVerificationCount)}**`,
      this.renderCoverage(snapshot),
      "",
    ].join("\n");
  }
}
