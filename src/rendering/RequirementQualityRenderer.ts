import type { RequirementQualityReport } from "../models/RequirementQualityReport";
import { MarkdownReportBuilder } from "./MarkdownReportBuilder";

export class RequirementQualityRenderer {
  public render(report: RequirementQualityReport): string {
    const builder = new MarkdownReportBuilder();

    builder.heading("Requirement Quality Report");
    builder.blank();

    builder.line(`Requirements: **${String(report.requirementCount)}**`);
    builder.line(`Average quality score: **${String(report.averageScore)}%**`);

    if (report.entries.length > 0) {
      builder.blank();
      builder.section("Requirements");

      for (const entry of report.entries) {
        builder.blank();
        builder.line(`### ${entry.requirementId} – ${entry.title}`);
        builder.line(`Score: **${String(entry.score)}%**`);

        if (entry.issues.length === 0) {
          builder.line("No issues found.");
        } else {
          builder.blank();
          builder.line("Issues:");

          for (const issue of entry.issues) {
            builder.bullet(issue.message);
          }
        }
      }
    }

    builder.blank();

    return builder.build();
  }
}
