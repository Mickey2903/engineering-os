import type { VerificationCoverageReport } from "../models/VerificationCoverageReport";
import { MarkdownReportBuilder } from "./MarkdownReportBuilder";

export class VerificationCoverageRenderer {
  public render(report: VerificationCoverageReport): string {
    const builder = new MarkdownReportBuilder();

    builder.heading("Verification Coverage Report");
    builder.blank();

    builder.line(`Requirements: **${String(report.requirementCount)}**`);
    builder.line(
      `Verified requirements: **${String(report.verifiedRequirementCount)}**`,
    );
    builder.line(
      `Coverage: **${String(report.coveragePercentage)}%**`,
    );

    if (report.missingVerifications.length > 0) {
      builder.blank();
      builder.section("Missing verifications");
      builder.blank();

      for (const requirement of report.missingVerifications) {
        builder.bullet(`${requirement.requirementId} – ${requirement.title}`);
      }
    }

    builder.blank();

    return builder.build();
  }
}
