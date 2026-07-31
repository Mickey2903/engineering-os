import type { TemplateDeploymentService } from "../services/TemplateDeploymentService";
interface WorkspaceWriter {
  createFolder(path: string): Promise<void>;
}


export class InitializeEngineeringWorkspaceCommand {

  public constructor(
  private readonly writer: WorkspaceWriter,
  private readonly templates: TemplateDeploymentService,
) {}


  public async execute(): Promise<void> {
    await this.templates.deploy();
    const folders = [
      "Engineering",
      "Engineering/Projects",
      "Engineering/Requirements",
      "Engineering/Components",
      "Engineering/Verification",
      "Engineering/Risks",
      "Engineering/Architecture",
      "Engineering/Interfaces",
      "Engineering/Reports",
    ];


    for (const folder of folders) {
      await this.writer.createFolder(folder);
    }
  }
}
