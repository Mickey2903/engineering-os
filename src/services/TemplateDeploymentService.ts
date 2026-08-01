import type { TemplateRepository } from "./TemplateRepository";

export interface TemplateWriter {

  exists(
    path: string,
  ): Promise<boolean>;


  write(
    path: string,
    content: string,
  ): Promise<void>;
}

export class TemplateDeploymentService {

  public constructor(
    private readonly writer: TemplateWriter,
    private readonly templates: TemplateRepository,
  ) {}


  public async deploy(): Promise<{
    createdTemplates: readonly string[];
    skippedTemplates: readonly string[];
  }> {

    const createdTemplates: string[] = [];
    const skippedTemplates: string[] = [];


    const templates = [
      {
        source: "Requirement.md",
        target:
          "Engineering/Requirements/Requirement Template.md",
      },
      {
        source: "Component.md",
        target:
          "Engineering/Components/Component Template.md",
      },
      {
        source: "Verification.md",
        target:
          "Engineering/Verification/Verification Template.md",
      },
      {
        source: "Risk.md",
        target:
          "Engineering/Risks/Risk Template.md",
      },
      {
        source: "Architecture.md",
        target:
          "Engineering/Architecture/Architecture Template.md",
      },
      {
        source: "Interface.md",
        target:
          "Engineering/Interfaces/Interface Template.md",
      },
      {
        source: "Project.md",
        target:
          "Engineering/Projects/Project Template.md",
      },
    ];


    for (const template of templates) {

      const content =
        await this.templates.getTemplate(
          template.source,
        );


      const exists =
  await this.writer.exists(
    template.target,
  );


if (exists) {

  skippedTemplates.push(
    template.target,
  );

} else {

  await this.writer.write(
    template.target,
    content,
  );

  createdTemplates.push(
    template.target,
  );
}
    }


    return {
      createdTemplates,
      skippedTemplates,
    };
  }
}
