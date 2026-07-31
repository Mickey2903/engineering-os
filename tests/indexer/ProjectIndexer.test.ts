import { describe, expect, it } from "vitest";

import { ProjectIndexer } from "../../src/indexer/ProjectIndexer";
import { EngineeringProjectRepository } from "../../src/repositories/EngineeringProjectRepository";

describe("ProjectIndexer", () => {
  it("adds projects from metadata", () => {
    const repository =
      new EngineeringProjectRepository();

    const indexer =
      new ProjectIndexer(repository);

    indexer.index({
      type: "project",
      id: "ROBOT-001",
      name: "Mars Rover",
      description: "Autonomous rover",
      projectType: "robotics",
      status: "development",
    });

    const project =
      repository.findById(
        "ROBOT-001",
      );

    expect(project).toBeDefined();

    expect(project?.name)
      .toBe("Mars Rover");
  });


  it("ignores non-project metadata", () => {
    const repository =
      new EngineeringProjectRepository();

    const indexer =
      new ProjectIndexer(repository);

    indexer.index({
      type: "requirement",
      id: "REQ-001",
      name: "Requirement",
    });

    expect(
      repository.findAll().length,
    ).toBe(0);
  });
});
