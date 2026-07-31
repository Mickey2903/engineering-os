import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { RequirementRepository } from "../../../src/database/repositories/RequirementRepository";
import type { Requirement } from "../../../src/models/Requirement";

function createRequirement(id: string, overrides: Partial<Requirement> = {}): Requirement {
  return {
    id,
    type: "requirement",
    title: id,
    status: "draft",
    tags: [],
    sourcePath: `Requirements/${id}.md`,
    links: [],
    createdTime: 0,
    modifiedTime: 0,
    metadata: {},
    domain: "power",
    priority: "medium",
    rationale: "",
    acceptanceCriteria: [],
    verificationMethod: "test",
    ...overrides,
  };
}

describe("RequirementRepository", () => {
  it("finds requirements by domain", () => {
    const db = new EngineeringDatabase();

    db.upsert(createRequirement("REQ-001", { domain: "power" }));
    db.upsert(createRequirement("REQ-002", { domain: "io" }));
    db.upsert(createRequirement("REQ-003", { domain: "power" }));

    const repo = new RequirementRepository(db);

    expect(repo.findByDomain("power")).toHaveLength(2);
    expect(repo.findByDomain("io")).toHaveLength(1);
  });

  it("finds requirements by priority", () => {
    const db = new EngineeringDatabase();

    db.upsert(createRequirement("REQ-001", { priority: "critical" }));
    db.upsert(createRequirement("REQ-002", { priority: "low" }));

    const repo = new RequirementRepository(db);

    expect(repo.findByPriority("critical")).toHaveLength(1);
    expect(repo.findByPriority("low")).toHaveLength(1);
  });

  it("finds requirements by status", () => {
    const db = new EngineeringDatabase();

    db.upsert(createRequirement("REQ-001", { status: "approved" }));
    db.upsert(createRequirement("REQ-002", { status: "draft" }));

    const repo = new RequirementRepository(db);

    expect(repo.findByStatus("approved")).toHaveLength(1);
    expect(repo.findByStatus("draft")).toHaveLength(1);
  });

  it("finds requirements by tag", () => {
    const db = new EngineeringDatabase();

    db.upsert(createRequirement("REQ-001", { tags: ["power", "safety"] }));
    db.upsert(createRequirement("REQ-002", { tags: ["io"] }));

    const repo = new RequirementRepository(db);

    expect(repo.findByTag("power")).toHaveLength(1);
    expect(repo.findByTag("io")).toHaveLength(1);
    expect(repo.findByTag("unknown")).toHaveLength(0);
  });
});
