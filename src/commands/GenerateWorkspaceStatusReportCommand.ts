import type { WorkspaceStatusService } from "../services/WorkspaceStatusService";
import type { WorkspaceStatusRenderer } from "../rendering/WorkspaceStatusRenderer";
import type { WorkspaceStatusReport } from "../models/WorkspaceStatusReport";

export interface WorkspaceStatusProvider {
  generate(): Promise<WorkspaceStatusReport>;
}

export interface ReportWriter {
  write(
    path: string,
    content: string,
  ): Promise<void>;
}


export class GenerateWorkspaceStatusReportCommand {

  public constructor(
    private readonly service: WorkspaceStatusProvider,
    private readonly renderer: WorkspaceStatusRenderer,
    private readonly writer: ReportWriter,
  ) {}


  public async execute(): Promise<void> {

    const report =
      await this.service.generate();


    const markdown =
      this.renderer.render(
        report,
      );


    await this.writer.write(
      "Engineering/Reports/Workspace Status.md",
      markdown,
    );

  }

}
