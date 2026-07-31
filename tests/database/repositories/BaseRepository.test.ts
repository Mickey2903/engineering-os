import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { BaseRepository } from "../../../src/database/repositories/BaseRepository";
import { isRequirement, type EngineeringEntity } from "../../../src/models/EngineeringEntity";
import type { Requirement } from "../../../src/models/Requirement";

class TestRequirementRepository extends BaseRepository<Requirement> {
  public constructor(database: EngineeringDatabase) {
    super(database, isRequirement);
  }

  public findByTitle(title: string): readonly Requirement[] {
    return this.findWhere((requirement) => requirement.title === title);
  }
}

function createRequirement(id: string, title = "Test requirement"): Requirement {
  return {
    id,
    type: "requirement",
    title,
    status: "draft",
    tags: [],
    sourcePath: `Requirements/${id}.md`,
    links: [],
    createdTime: 100,
    modifiedTime: 200,
    metadata: {},
    domain: "unknown",
    priority: "unknown",
    rationale: "",
    acceptanceCriteria: [],
    verificationMethod: "unknown",
  };
}

function createNonRequirement(): EngineeringEntity {
  return {
    id: "CMP-001",
    type: "component",
    title: "Test component",
    status: "draft",
    tags: [],
    sourcePath: "Components/CMP-001.md",
    links: [],
    createdTime: 100,
    modifiedTime: 200,
    metadata: {},
    manufacturer: "Test manufacturer",
    partNumber: "TEST-001",
    datasheet: "",
    lifecycle: "unknown",
  };
}

describe("BaseRepository", () => {
  it("starts empty", () => {
    const database = new EngineeringDatabase();
    const repository = new TestRequirementRepository(database);

    expect(repository.count()).toBe(0);
    expect(repository.findAll()).toEqual([]);
    expect(repository.exists("REQ-001")).toBe(false);
    expect(repository.findById("REQ-001")).toBeUndefined();
  });

  it("reads matching entities from the database", () => {
    const database = new EngineeringDatabase();
    const repository = new TestRequirementRepository(database);
    const requirement = createRequirement("REQ-001");

    database.upsert(requirement);

    expect(repository.count()).toBe(1);
    expect(repository.exists("REQ-001")).toBe(true);
    expect(repository.findById("REQ-001")).toEqual(requirement);
    expect(repository.findAll()).toEqual([requirement]);
  });

  it("ignores entities of other types", () => {
    const database = new EngineeringDatabase();
    const repository = new TestRequirementRepository(database);

    database.upsert(createNonRequirement());

    expect(repository.count()).toBe(0);
    expect(repository.findAll()).toEqual([]);
    expect(repository.findById("CMP-001")).toBeUndefined();
    expect(repository.exists("CMP-001")).toBe(false);
  });

  it("reflects database updates", () => {
    const database = new EngineeringDatabase();
    const repository = new TestRequirementRepository(database);

    database.upsert(createRequirement("REQ-001"));

    expect(repository.count()).toBe(1);

    database.upsert(createRequirement("REQ-002"));

    expect(repository.count()).toBe(2);
  });

  it("supports filtered searches", () => {
    const database = new EngineeringDatabase();
    const repository = new TestRequirementRepository(database);

    database.upsert(createRequirement("REQ-001", "Power supply"));
    database.upsert(createRequirement("REQ-002", "Power supply"));
    database.upsert(createRequirement("REQ-003", "Digital input"));

    expect(repository.findByTitle("Power supply")).toHaveLength(2);
    expect(repository.findByTitle("Digital input")).toHaveLength(1);
    expect(repository.findByTitle("Unknown")).toEqual([]);
  });
});
