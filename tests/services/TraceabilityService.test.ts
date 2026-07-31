import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import type { Component } from "../../src/models/Component";
import type { Requirement } from "../../src/models/Requirement";
import { TraceabilityService } from "../../src/services/TraceabilityService";

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

const component = (id: string): Component => ({
  id,
  title: id,
  type: "component",
  status: "draft",
  sourcePath: `Components/${id}.md`,
  tags: [],
  links: [],
  metadata: {},
  modifiedTime: 1,
  lifecycle: "active",
});

describe("TraceabilityService", () => {
  it("finds all reachable engineering entities", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001", ["CMP-001"]));
    database.upsert(component("CMP-001"));

    const service = new TraceabilityService(database);

    const reachable = service.findReachableEntities("REQ-001");

    expect(reachable.map((entity) => entity.id)).toEqual(["CMP-001"]);
  });

  it("ignores relationships to missing entities", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001", ["UNKNOWN"]));

    const service = new TraceabilityService(database);

    expect(service.findReachableEntities("REQ-001")).toEqual([]);
  });
});

it("finds the shortest path as engineering entities", () => {
  const database = new EngineeringDatabase();

  database.upsert(requirement("REQ-001", ["CMP-001"]));
  database.upsert(component("CMP-001"));

  const verification = {
    id: "VER-001",
    title: "VER-001",
    type: "verification",
    status: "draft",
    sourcePath: "Verifications/VER-001.md",
    tags: [],
    links: [],
    metadata: {},
    modifiedTime: 1,
    requirementIds: [],
    componentIds: ["CMP-001"],
    method: "test",
    result: "unknown",
  } as const;

  database.upsert(verification);

  const service = new TraceabilityService(database);

  expect(service.findShortestPathEntities("REQ-001", "CMP-001").map((entity) => entity.id)).toEqual(
    ["REQ-001", "CMP-001"],
  );
});

it("returns an empty result when no path exists", () => {
  const database = new EngineeringDatabase();

  database.upsert(requirement("REQ-001", ["CMP-001"]));
  database.upsert(component("CMP-001"));
  database.upsert(component("CMP-999"));

  const service = new TraceabilityService(database);

  expect(service.findShortestPathEntities("REQ-001", "CMP-999")).toEqual([]);
});

describe("createSnapshot", () => {
  it("creates an empty traceability snapshot", () => {
    const database = new EngineeringDatabase();
    const service = new TraceabilityService(database);

    expect(service.createSnapshot()).toEqual({
      requirementCount: 0,
      tracedRequirementCount: 0,
      missingComponentCount: 0,
      missingVerificationCount: 0,
      missingComponents: [],
    });
  });
});

describe("createSnapshot requirement count", () => {
  it("counts requirements in the snapshot", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001"));
    database.upsert(requirement("REQ-002"));
    database.upsert(component("CMP-001"));

    const service = new TraceabilityService(database);

    expect(service.createSnapshot().requirementCount).toBe(2);
  });
});

describe("createSnapshot traced requirements", () => {
  it("counts traced requirements", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001", ["CMP-001"]));
    database.upsert(component("CMP-001"));

    database.upsert(requirement("REQ-002"));

    const service = new TraceabilityService(database);

    expect(service.createSnapshot().tracedRequirementCount).toBe(1);
  });
});

describe("createSnapshot missing components", () => {
  it("counts requirements without components", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001", ["CMP-001"]));
    database.upsert(component("CMP-001"));

    database.upsert(requirement("REQ-002"));

    const service = new TraceabilityService(database);

    expect(service.createSnapshot().missingComponentCount).toBe(1);
  });

  it("includes requirements without components", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001", ["CMP-001"]));
    database.upsert(component("CMP-001"));

    const missingRequirement = requirement("REQ-002");
    database.upsert(missingRequirement);

    const service = new TraceabilityService(database);

    expect(service.createSnapshot().missingComponents).toEqual([missingRequirement]);
  });
});

describe("createSnapshot missing verifications", () => {
  it("counts requirements without verifications", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001"));

    database.upsert({
      id: "VER-001",
      title: "VER-001",
      type: "verification",
      status: "draft",
      sourcePath: "Verifications/VER-001.md",
      tags: [],
      links: [],
      metadata: {},
      modifiedTime: 1,
      requirementIds: ["REQ-001"],
      method: "test",
      result: "unknown",
    });

    database.upsert(requirement("REQ-002"));

    const service = new TraceabilityService(database);

    expect(service.createSnapshot().missingVerificationCount).toBe(1);
  });
});
