import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { EngineeringProjectRepository } from "../../src/repositories/EngineeringProjectRepository";
import { EngineeringProjectDashboardService } from "../../src/services/EngineeringProjectDashboardService";

describe("EngineeringProjectDashboardService", () => {
  it("creates dashboard metrics for a project", () => {
    const database =
      new EngineeringDatabase();

    const projects =
      new EngineeringProjectRepository();

    projects.add({
      id: "PLC-001",
      name: "PLC Controller",
      description: "Industrial PLC project",
      type: "embedded",
      status: "development",
      createdAt: "2026-07-31",
      updatedAt: "2026-07-31",
    });

    database.upsert({
      id: "REQ-001",
      type: "requirement",
      title: "24V input support",
      status: "active",
      tags: [],
      sourcePath: "req.md",
      links: [],
      modifiedTime: Date.now(),
      metadata: {},
      projectId: "PLC-001",
      domain: "power",
      priority: "high",
      acceptanceCriteria: [],
    });

    const service =
      new EngineeringProjectDashboardService(
        database,
        projects,
      );

    const dashboard =
      service.generate("PLC-001");

    expect(dashboard.projectName)
      .toBe("PLC Controller");

    expect(dashboard.requirementCount)
      .toBe(1);
  });
});
