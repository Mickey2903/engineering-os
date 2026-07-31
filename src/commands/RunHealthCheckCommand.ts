import type { HealthReport } from "../services/HealthService";

interface HealthReportProvider {
  healthReport(): HealthReport;
}

interface EngineeringServicesLike {
  health: HealthReportProvider;
}

interface HealthReportRendererLike {
  render(report: HealthReport): string;
}

interface ReportWriter {
  write(path: string, content: string): Promise<void>;
}

export class RunHealthCheckCommand {
  public constructor(
    private readonly services: EngineeringServicesLike,
    private readonly renderer: HealthReportRendererLike,
    private readonly writer: ReportWriter,
  ) {}

  public async execute(): Promise<void> {
    const report = this.services.health.healthReport();
    const markdown = this.renderer.render(report);

    await this.writer.write("Engineering/Reports/Health Report.md", markdown);
  }
}
