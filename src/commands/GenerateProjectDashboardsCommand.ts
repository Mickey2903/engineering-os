import type { EngineeringProjectRepository } from "../repositories/EngineeringProjectRepository";
import type { EngineeringProjectDashboardService } from "../services/EngineeringProjectDashboardService";
import type { EngineeringProjectDashboardRenderer } from "../rendering/EngineeringProjectDashboardRenderer";

interface ReportWriter {
  write(path: string, content: string): Promise<void>;
}

export class GenerateProjectDashboardsCommand {
  public constructor(
    private readonly projects: EngineeringProjectRepository,
    private readonly dashboards: EngineeringProjectDashboardService,
    private readonly renderer: EngineeringProjectDashboardRenderer,
    private readonly writer: ReportWriter,
  ) {}

  public async execute(): Promise<void> {
    const projects =
      this.projects.findAll();

    for (const project of projects) {
      const dashboard =
        this.dashboards.generate(
          project.id,
        );

      const content =
        this.renderer.render(
          dashboard,
        );

      await this.writer.write(
        `Engineering/Projects/${project.name}/Dashboard.md`,
        content,
      );
    }
  }
}
