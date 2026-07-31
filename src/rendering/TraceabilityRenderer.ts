import type { TraceabilitySnapshot } from "../models/TraceabilitySnapshot";
import { MarkdownReportBuilder } from "./MarkdownReportBuilder";

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
    const builder = new MarkdownReportBuilder();

    builder.heading("Traceability Report");
    builder.blank();

    builder.metric("Requirements", snapshot.requirementCount);
    builder.metric("Traced requirements", snapshot.tracedRequirementCount);
    builder.metric("Missing components", snapshot.missingComponentCount);
    builder.metric("Missing verifications", snapshot.missingVerificationCount);
    builder.line(this.renderCoverage(snapshot));

    if (snapshot.missingComponents.length > 0) {
      builder.blank();
      builder.section("Requirements without components");
      builder.blank();

      for (const requirement of snapshot.missingComponents) {
        builder.bullet(`${requirement.id} – ${requirement.title}`);
      }
    }

    builder.blank();

    return builder.build();
  }
}
