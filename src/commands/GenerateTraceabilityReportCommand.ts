import type { TraceabilitySnapshot } from "../models/TraceabilitySnapshot";

interface TraceabilitySnapshotProvider {
  createSnapshot(): TraceabilitySnapshot;
}

interface EngineeringServicesLike {
  traceability: TraceabilitySnapshotProvider;
}

interface TraceabilityRendererLike {
  render(snapshot: TraceabilitySnapshot): string;
}

interface ReportWriter {
  write(path: string, content: string): Promise<void>;
}

export class GenerateTraceabilityReportCommand {
  public constructor(
    private readonly services: EngineeringServicesLike,
    private readonly renderer: TraceabilityRendererLike,
    private readonly writer: ReportWriter,
  ) {}

  public async execute(): Promise<void> {
    const snapshot = this.services.traceability.createSnapshot();
    const markdown = this.renderer.render(snapshot);

    await this.writer.write("Engineering/Reports/Traceability Report.md", markdown);
  }
}
