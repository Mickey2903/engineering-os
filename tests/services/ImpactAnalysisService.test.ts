import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import type { Component } from "../../src/models/Component";
import type { Requirement } from "../../src/models/Requirement";
import { ImpactAnalysisService } from "../../src/services/ImpactAnalysisService";

const requirement = (id: string, links: readonly string[] = []): Requirement => ({
  id,
  title: id,
  type: "requirement",
  status: "draft",
  sourcePath: `Requirements/${id}.md`,
  tags: [],
  links,
  metadata: {},
  modifiedTime: 1,
  domain: "system",
  priority: "medium",
  acceptanceCriteria: [],
});

const component = (id: string, links: readonly string[] = []): Component => ({
  id,
  title: id,
  type: "component",
  status: "draft",
  sourcePath: `Components/${id}.md`,
  tags: [],
  links,
  metadata: {},
  modifiedTime: 1,
  lifecycle: "active",
});

describe("ImpactAnalysisService", () => {
  it("finds directly and indirectly impacted entities", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001", ["CMP-001"]));
    database.upsert(component("CMP-001", ["CMP-002"]));
    database.upsert(component("CMP-002"));

    const service = new ImpactAnalysisService(database);

    expect(service.findImpactedEntities("REQ-001").map((entity) => entity.id)).toEqual([
      "CMP-001",
      "CMP-002",
    ]);
  });
});
