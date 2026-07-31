import type { EngineeringReportService } from "../services/EngineeringReportService";

interface ReportWriter {
  write(path: string, content: string): Promise<void>;
}

export class GenerateEngineeringReportsCommand {
  public constructor(
    private readonly reports: EngineeringReportService,
    private readonly writer: ReportWriter,
  ) {}

  public async execute(): Promise<void> {
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
  }
}
