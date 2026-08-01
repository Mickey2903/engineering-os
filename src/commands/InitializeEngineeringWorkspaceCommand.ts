import type { TemplateDeploymentService } from "../services/TemplateDeploymentService";
import type { WorkspaceInitializationReport } from "../models/WorkspaceInitializationReport";


interface WorkspaceWriter {
  createFolder(
    path: string,
  ): Promise<void>;
}


export class InitializeEngineeringWorkspaceCommand {

  public constructor(
    private readonly writer: WorkspaceWriter,
    private readonly templates: TemplateDeploymentService,
  ) {}


  public async execute(): Promise<WorkspaceInitializationReport> {

    const createdFolders: string[] = [];


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

      await this.writer.createFolder(
        folder,
      );

      createdFolders.push(
        folder,
      );
    }


    const templateResult =
      await this.templates.deploy();


    return {
      createdFolders,

      createdTemplates:
        templateResult.createdTemplates,

      skippedTemplates:
        templateResult.skippedTemplates,
    };
  }
}
