import type { ImpactAnalysisReport } from "../models/ImpactAnalysisReport";
import { MarkdownReportBuilder } from "./MarkdownReportBuilder";

export class ImpactAnalysisRenderer {
  public render(
    report: ImpactAnalysisReport,
  ): string {
    const builder = new MarkdownReportBuilder();

    builder.heading("Impact Analysis Report");

    builder.blank();

    builder.section("Changed Object");

    builder.line(
      report.rootObjectId,
    );

    builder.blank();

    builder.section("Affected Objects");

    for (const object of report.affectedObjects) {
      builder.bullet(object);
    }

    builder.blank();

    builder.section("Affected Components");

    for (const component of report.affectedComponents) {
      builder.bullet(component);
    }

    builder.blank();

    builder.section("Affected Tests");

    for (const test of report.affectedTests) {
      builder.bullet(test);
    }

    return builder.build();
  }
}
