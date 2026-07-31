import type { ProjectMetadata } from "../models/ProjectMetadata";

export class ProjectMetadataParser {
  public parse(
    metadata: Record<string, unknown>,
  ): ProjectMetadata | undefined {
    if (metadata.type !== "project") {
      return undefined;
    }

    if (
      typeof metadata.id !== "string" ||
      typeof metadata.name !== "string"
    ) {
      return undefined;
    }

    const project: ProjectMetadata = {
  id: metadata.id,
  name: metadata.name,

  projectType:
    typeof metadata.projectType === "string"
      ? metadata.projectType
      : "unknown",

  status:
    typeof metadata.status === "string"
      ? metadata.status
      : "unknown",

  ...(typeof metadata.description === "string"
    ? {
        description: metadata.description,
      }
    : {}),
};

return project;
  }
}
