import type { EngineeringReportService } from "../services/EngineeringReportService";
import type { EngineeringMetricsPersistenceService } from "../services/EngineeringMetricsPersistenceService";

interface ReportWriter {
  write(path: string, content: string): Promise<void>;
}

export class GenerateEngineeringReportsCommand {
  public constructor(
    private readonly reports: EngineeringReportService,
    private readonly writer: ReportWriter,
    private readonly metrics: EngineeringMetricsPersistenceService,
  ) {}

  public async execute(): Promise<void> {
    const date =
      new Date().toISOString().split("T")[0] ?? "unknown";

    await this.metrics.capture(date);

    const report = this.reports.generate();

    await this.writer.write("Engineering/Reports/Dashboard.md", report.dashboard);

    await this.writer.write("Engineering/Reports/Traceability Report.md", report.traceability);

    await this.writer.write("Engineering/Reports/Health Report.md", report.health);

    await this.writer.write(
      "Engineering/Reports/Requirement Quality Report.md",
      report.requirementQuality,
    );

    await this.writer.write(
      "Engineering/Reports/Verification Coverage Report.md",
      report.verificationCoverage,
    );

    await this.writer.write(
      "Engineering/Reports/Engineering Intelligence Dashboard.md",
      report.intelligence,
    );

    await this.writer.write(
      "Engineering/Reports/Engineering Trend Report.md",
      report.trend,
    );

    await this.writer.write(
      "Engineering/Reports/Impact Analysis Report.md",
      report.impactAnalysis,
    );

    await this.writer.write(
      "Engineering/Reports/Verification Traceability Matrix.md",
      report.verificationTraceability,
    );
  }
}
