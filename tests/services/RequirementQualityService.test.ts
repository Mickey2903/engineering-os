import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { RequirementQualityService } from "../../src/services/RequirementQualityService";

function requirement(overrides = {}) {
  return {
    id: "REQ-001",
    type: "requirement" as const,
    title: "Emergency stop",
    status: "approved" as const,
    tags: [],
    sourcePath: "Requirements/REQ-001.md",
    links: ["CMP-001"],
    modifiedTime: 1,
    metadata: {},
    domain: "safety" as const,
    priority: "critical" as const,
    description: "Stops the machine.",
    rationale: "Required for safety.",
    acceptanceCriteria: ["Machine stops"],
    verificationMethod: "test" as const,
    ...overrides,
  };
}

function component() {
  return {
    id: "CMP-001",
    type: "component" as const,
    title: "Safety controller",
    status: "approved" as const,
    tags: [],
    sourcePath: "Components/CMP-001.md",
    links: [],
    modifiedTime: 1,
    metadata: {},
  };
}

describe("RequirementQualityService", () => {
  it("returns empty report", () => {
    const service = new RequirementQualityService(new EngineeringDatabase());

    expect(service.analyze()).toEqual({
      requirementCount: 0,
      averageScore: 0,
      entries: [],
    });
  });

  it("calculates quality score for complete requirement", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement());
    database.upsert(component());

    const service = new RequirementQualityService(database);

    const report = service.analyze();
    const entry = report.entries[0];

    expect(report.requirementCount).toBe(1);
    expect(entry).toBeDefined();
    expect(entry?.score).toBe(100);
  });

  it("detects missing requirement information", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      requirement({
        description: undefined,
        rationale: undefined,
        acceptanceCriteria: [],
        verificationMethod: undefined,
        links: [],
      }),
    );

    const service = new RequirementQualityService(database);

    const entry = service.analyze().entries[0];

    expect(entry).toBeDefined();
    expect(entry?.score).toBe(15);
    expect(entry?.issues.length).toBe(5);
  });
});
