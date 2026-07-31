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

  private renderMissingComponents(snapshot: TraceabilitySnapshot): readonly string[] {
    if (snapshot.missingComponents.length === 0) {
      return [];
    }

    return [
      "",
      "## Requirements without components",
      "",
      ...snapshot.missingComponents.map(
        (requirement) => `- ${requirement.id} – ${requirement.title}`,
      ),
    ];
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
      ...this.renderMissingComponents(snapshot),
      "",
    ].join("\n");
  }
}
