import { describe, expect, it } from "vitest";

import { WorkspaceStatusService } from "../../src/services/WorkspaceStatusService";
import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { WorkspaceVersionService } from "../../src/services/WorkspaceVersionService";


describe("WorkspaceStatusService", () => {

  it("generates workspace statistics", async () => {

    const database =
      new EngineeringDatabase();


    database.upsert({
      id: "REQ-001",
      type: "requirement",
      title: "Test requirement",
      status: "approved",
      tags: [],
      sourcePath: "Requirements/Test.md",
      links: [],
      modifiedTime: 1,
      metadata: {},

      domain: "control",
      priority: "high",
      acceptanceCriteria: [
        "System responds correctly",
      ],
    });


    database.upsert({
      id: "CMP-001",
      type: "component",
      title: "Test component",
      status: "active",
      tags: [],
      sourcePath: "Components/Test.md",
      links: [],
      modifiedTime: 1,
      metadata: {},

      lifecycle: "prototype",
    });


    database.upsert({
      id: "RISK-001",
      type: "risk",
      title: "Test risk",
      status: "active",
      tags: [],
      sourcePath: "Risks/Test.md",
      links: [],
      modifiedTime: 1,
      metadata: {},

      level: "medium",
      riskState: "open",
    });


    const versions =
      new WorkspaceVersionService(

        async (): Promise<string> => {
          return `
---
version: 1
---
`;
        },

        async (): Promise<void> => {},

      );


    const service =
      new WorkspaceStatusService(
        versions,
        database,
      );


    const result =
      await service.generate();


    expect(
      result.workspaceVersion,
    )
      .toBe(1);


    expect(
      result.indexedObjects,
    )
      .toBe(3);


    expect(
      result.requirements,
    )
      .toBe(1);


    expect(
      result.components,
    )
      .toBe(1);


    expect(
      result.risks,
    )
      .toBe(1);

  });

});
