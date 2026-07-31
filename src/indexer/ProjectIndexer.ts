import type { Vault } from "obsidian";
import type { EngineeringProjectRepository } from "../repositories/EngineeringProjectRepository";
import { ProjectMetadataParser } from "../parser/ProjectMetadataParser";

export class ProjectIndexer {
  private readonly parser =
    new ProjectMetadataParser();

  public constructor(
    private readonly repository: EngineeringProjectRepository,
  ) {}

  public index(
    metadata: Record<string, unknown>,
  ): void {
    const project =
      this.parser.parse(metadata);

    if (!project) {
      return;
    }

    this.repository.add({
      id: project.id,
      name: project.name,
      description:
        project.description ?? "",
      type: project.projectType,
      status:
        project.status as
          | "concept"
          | "development"
          | "testing"
          | "production"
          | "archived",
      createdAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    });
  }
}
