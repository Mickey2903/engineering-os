import type { EngineeringMetricSnapshot } from "../models/EngineeringMetricSnapshot";
import type { EngineeringTrendReport } from "../models/EngineeringTrendReport";
import { MarkdownReportBuilder } from "./MarkdownReportBuilder";

export class EngineeringTrendRenderer {
  public render(
    report: EngineeringTrendReport,
    history: readonly EngineeringMetricSnapshot[],
  ): string {
    const builder = new MarkdownReportBuilder();

    builder.heading("Engineering Trend Report");
    builder.blank();

    builder.section("Current Maturity");
    builder.blank();
    builder.line(`Score: **${String(report.currentScore)}%**`);

    builder.blank();

    builder.section("Trend");
    builder.blank();

    builder.line(`Direction: **${report.direction}**`);
    builder.line(`Change: **${String(report.scoreChange)}%**`);

    builder.blank();

    builder.section("Strongest Improvement");
    builder.blank();
    builder.line(report.strongestMetric);

    builder.blank();

    builder.section("History");
    builder.blank();

    for (const snapshot of history) {
      builder.bullet(
        `${snapshot.date}: ${String(snapshot.overallScore)}%`,
      );
    }

    return builder.build();
  }
}
