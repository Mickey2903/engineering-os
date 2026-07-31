import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { RiskRepository } from "../../../src/database/repositories/RiskRepository";
import type { Risk } from "../../../src/models/Risk";

function createRisk(id: string, overrides: Partial<Risk> = {}): Risk {
  return {
    id,
    type: "risk",
    title: id,
    status: "draft",
    tags: [],
    sourcePath: `Risks/${id}.md`,
    links: [],
    createdTime: 0,
    modifiedTime: 0,
    metadata: {},
    level: "unknown",
    riskState: "open",
    ...overrides,
  };
}

describe("RiskRepository", () => {
  it("finds risks by level", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createRisk("RSK-001", {
        level: "high",
      }),
    );
    database.upsert(
      createRisk("RSK-002", {
        level: "low",
      }),
    );
    database.upsert(
      createRisk("RSK-003", {
        level: "high",
      }),
    );

    const repository = new RiskRepository(database);

    expect(repository.findByLevel("high")).toHaveLength(2);
    expect(repository.findByLevel("low")).toHaveLength(1);
  });

  it("finds risks by state", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createRisk("RSK-001", {
        riskState: "open",
      }),
    );
    database.upsert(
      createRisk("RSK-002", {
        riskState: "mitigating",
      }),
    );
    database.upsert(
      createRisk("RSK-003", {
        riskState: "closed",
      }),
    );

    const repository = new RiskRepository(database);

    expect(repository.findByState("open")).toHaveLength(1);
    expect(repository.findByState("mitigating")).toHaveLength(1);
    expect(repository.findByState("closed")).toHaveLength(1);
  });

  it("finds risks by owner", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createRisk("RSK-001", {
        owner: "Michael",
      }),
    );
    database.upsert(
      createRisk("RSK-002", {
        owner: "Engineering",
      }),
    );
    database.upsert(createRisk("RSK-003"));

    const repository = new RiskRepository(database);

    expect(repository.findByOwner("Michael")).toHaveLength(1);
    expect(repository.findByOwner("Engineering")).toHaveLength(1);
    expect(repository.findByOwner("Unknown")).toEqual([]);
  });

  it("finds risks by minimum probability", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createRisk("RSK-001", {
        probability: 2,
      }),
    );
    database.upsert(
      createRisk("RSK-002", {
        probability: 4,
      }),
    );
    database.upsert(
      createRisk("RSK-003", {
        probability: 5,
      }),
    );
    database.upsert(createRisk("RSK-004"));

    const repository = new RiskRepository(database);

    expect(repository.findByMinimumProbability(4)).toHaveLength(2);
    expect(repository.findByMinimumProbability(5)).toHaveLength(1);
    expect(repository.findByMinimumProbability(6)).toEqual([]);
  });

  it("finds risks by minimum impact", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createRisk("RSK-001", {
        impact: 1,
      }),
    );
    database.upsert(
      createRisk("RSK-002", {
        impact: 3,
      }),
    );
    database.upsert(
      createRisk("RSK-003", {
        impact: 5,
      }),
    );
    database.upsert(createRisk("RSK-004"));

    const repository = new RiskRepository(database);

    expect(repository.findByMinimumImpact(3)).toHaveLength(2);
    expect(repository.findByMinimumImpact(5)).toHaveLength(1);
    expect(repository.findByMinimumImpact(6)).toEqual([]);
  });

  it("finds risks by tag", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createRisk("RSK-001", {
        tags: ["safety", "mechanical"],
      }),
    );
    database.upsert(
      createRisk("RSK-002", {
        tags: ["software"],
      }),
    );

    const repository = new RiskRepository(database);

    expect(repository.findByTag("safety")).toHaveLength(1);
    expect(repository.findByTag("software")).toHaveLength(1);
    expect(repository.findByTag("unknown")).toEqual([]);
  });
});
