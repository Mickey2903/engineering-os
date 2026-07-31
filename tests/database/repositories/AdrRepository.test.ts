import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { AdrRepository } from "../../../src/database/repositories/AdrRepository";
import type { Adr } from "../../../src/models/Adr";

function createAdr(id: string, overrides: Partial<Adr> = {}): Adr {
  return {
    id,
    type: "adr",
    title: id,
    status: "draft",
    tags: [],
    sourcePath: `Adrs/${id}.md`,
    links: [],
    createdTime: 0,
    modifiedTime: 0,
    metadata: {},
    decisionStatus: "proposed",
    consequences: [],
    ...overrides,
  };
}

describe("AdrRepository", () => {
  it("finds ADRs by decision status", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createAdr("ADR-001", {
        decisionStatus: "accepted",
      }),
    );
    database.upsert(
      createAdr("ADR-002", {
        decisionStatus: "proposed",
      }),
    );
    database.upsert(
      createAdr("ADR-003", {
        decisionStatus: "accepted",
      }),
    );

    const repository = new AdrRepository(database);

    expect(repository.findByDecisionStatus("accepted")).toHaveLength(2);
    expect(repository.findByDecisionStatus("proposed")).toHaveLength(1);
    expect(repository.findByDecisionStatus("rejected")).toEqual([]);
  });

  it("finds ADRs by superseded ADR id", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createAdr("ADR-002", {
        supersedesId: "ADR-001",
      }),
    );
    database.upsert(
      createAdr("ADR-003", {
        supersedesId: "ADR-001",
      }),
    );
    database.upsert(createAdr("ADR-004"));

    const repository = new AdrRepository(database);

    expect(repository.findBySupersedesId("ADR-001")).toHaveLength(2);
    expect(repository.findBySupersedesId("ADR-999")).toEqual([]);
  });

  it("finds ADRs with a non-empty decision", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createAdr("ADR-001", {
        decision: "Use Modbus TCP.",
      }),
    );
    database.upsert(
      createAdr("ADR-002", {
        decision: "   ",
      }),
    );
    database.upsert(createAdr("ADR-003"));

    const repository = new AdrRepository(database);

    expect(repository.findWithDecision()).toHaveLength(1);
    expect(repository.findWithDecision()[0]?.id).toBe("ADR-001");
  });

  it("finds ADRs with a non-empty context", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createAdr("ADR-001", {
        context: "The controller requires Ethernet communication.",
      }),
    );
    database.upsert(
      createAdr("ADR-002", {
        context: "",
      }),
    );
    database.upsert(createAdr("ADR-003"));

    const repository = new AdrRepository(database);

    expect(repository.findWithContext()).toHaveLength(1);
    expect(repository.findWithContext()[0]?.id).toBe("ADR-001");
  });

  it("finds ADRs by tag", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createAdr("ADR-001", {
        tags: ["architecture", "network"],
      }),
    );
    database.upsert(
      createAdr("ADR-002", {
        tags: ["safety"],
      }),
    );

    const repository = new AdrRepository(database);

    expect(repository.findByTag("architecture")).toHaveLength(1);
    expect(repository.findByTag("safety")).toHaveLength(1);
    expect(repository.findByTag("unknown")).toEqual([]);
  });
});
