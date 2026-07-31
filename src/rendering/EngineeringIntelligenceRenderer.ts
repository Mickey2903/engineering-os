import type { EngineeringIntelligenceReport } from "../models/EngineeringIntelligenceReport";
import { MarkdownReportBuilder } from "./MarkdownReportBuilder";

export class EngineeringIntelligenceRenderer {
  public render(report: EngineeringIntelligenceReport): string {
    const builder = new MarkdownReportBuilder();

    builder.heading("Engineering Intelligence Dashboard");
    builder.blank();

    builder.section("Overall Maturity");
    builder.blank();
    builder.line(`Score: **${String(report.overallScore)}%**`);

    builder.blank();
    builder.section("Engineering Metrics");
    builder.blank();

    builder.line(`Health: **${String(report.healthScore)}%**`);
    builder.line(
      `Requirement Quality: **${String(report.requirementQualityScore)}%**`,
    );
    builder.line(
      `Verification Coverage: **${String(report.verificationCoverageScore)}%**`,
    );
    builder.line(
      `Traceability: **${String(report.traceabilityScore)}%**`,
    );

    if (report.improvementAreas.length > 0) {
      builder.blank();
      builder.section("Improvement Areas");
      builder.blank();

      for (const area of report.improvementAreas) {
        builder.bullet(
          `${area.category} - ${area.message}`,
        );
      }
    }

    if (report.insights.length > 0) {
  builder.blank();
  builder.section("Intelligence Findings");
  builder.blank();

  for (const insight of report.insights) {
    builder.bullet(
      `${insight.severity}: ${insight.title} - ${insight.description}`,
    );
  }
}
builder.blank();

    return builder.build();
  }
}
