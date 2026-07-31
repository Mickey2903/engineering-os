import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import type { Requirement } from "../../src/models/Requirement";
import { HealthService } from "../../src/services/HealthService";

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

describe("HealthService", () => {
  it("finds entities with broken links", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001", ["UNKNOWN"]));

    const service = new HealthService(database);

    expect(service.findBrokenLinks()).toEqual([
      {
        entityId: "REQ-001",
        brokenLinkId: "UNKNOWN",
      },
    ]);
  });
});

it("finds orphan entities", () => {
  const database = new EngineeringDatabase();

  database.upsert(requirement("REQ-001"));
  database.upsert(requirement("REQ-002", ["REQ-003"]));
  database.upsert(requirement("REQ-003"));

  const service = new HealthService(database);

  expect(service.findOrphanEntities().map((entity) => entity.id)).toEqual(["REQ-001"]);
});

it("finds entities without incoming links", () => {
  const database = new EngineeringDatabase();

  database.upsert(requirement("REQ-001", ["REQ-002"]));
  database.upsert(requirement("REQ-002"));
  database.upsert(requirement("REQ-003"));

  const service = new HealthService(database);

  expect(service.findEntitiesWithoutIncomingLinks().map((entity) => entity.id)).toEqual([
    "REQ-001",
    "REQ-003",
  ]);
});

it("finds entities without outgoing links", () => {
  const database = new EngineeringDatabase();

  database.upsert(requirement("REQ-001", ["REQ-002"]));
  database.upsert(requirement("REQ-002"));
  database.upsert(requirement("REQ-003"));

  const service = new HealthService(database);

  expect(service.findEntitiesWithoutOutgoingLinks().map((entity) => entity.id)).toEqual([
    "REQ-002",
    "REQ-003",
  ]);
});

it("finds duplicate relationships", () => {
  const database = new EngineeringDatabase();

  database.upsert(requirement("REQ-001", ["REQ-002", "REQ-002"]));
  database.upsert(requirement("REQ-002"));

  const service = new HealthService(database);

  expect(service.findDuplicateRelationships()).toEqual([
    {
      sourceId: "REQ-001",
      targetId: "REQ-002",
    },
  ]);
});

it("creates a complete health report", () => {
  const database = new EngineeringDatabase();

  database.upsert(requirement("REQ-001", ["REQ-002", "REQ-002", "UNKNOWN"]));
  database.upsert(requirement("REQ-002"));
  database.upsert(requirement("REQ-003"));

  const service = new HealthService(database);

  const report = service.healthReport();

  expect(report.brokenLinks).toEqual([
    {
      entityId: "REQ-001",
      brokenLinkId: "UNKNOWN",
    },
  ]);

  expect(report.orphanEntities.map((entity) => entity.id)).toEqual(["REQ-003"]);

  expect(report.entitiesWithoutIncomingLinks.map((entity) => entity.id)).toEqual([
    "REQ-001",
    "REQ-003",
  ]);

  expect(report.entitiesWithoutOutgoingLinks.map((entity) => entity.id)).toEqual([
    "REQ-002",
    "REQ-003",
  ]);

  expect(report.duplicateRelationships).toEqual([
    {
      sourceId: "REQ-001",
      targetId: "REQ-002",
    },
  ]);
});
