import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { EngineeringWorkspace } from "../../src/database/EngineeringWorkspace";
import type { Adr } from "../../src/models/Adr";
import type { Component } from "../../src/models/Component";
import type { Requirement } from "../../src/models/Requirement";
import type { Risk } from "../../src/models/Risk";
import type { Verification } from "../../src/models/Verification";

function createRequirement(id: string): Requirement {
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
  };
}

function createComponent(id: string): Component {
  return {
    id,
    type: "component",
    title: id,
    status: "draft",
    tags: [],
    sourcePath: `Components/${id}.md`,
    links: [],
    createdTime: 0,
    modifiedTime: 0,
    metadata: {},
    manufacturer: "Test",
    partNumber: id,
    datasheet: "",
    lifecycle: "active",
  };
}

function createVerification(id: string): Verification {
  return {
    id,
    type: "verification",
    title: id,
    status: "draft",
    tags: [],
    sourcePath: `Verifications/${id}.md`,
    links: [],
    createdTime: 0,
    modifiedTime: 0,
    metadata: {},
    method: "test",
    requirementIds: ["REQ-001"],
    result: "unknown",
  };
}

function createRisk(id: string): Risk {
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
  };
}

function createAdr(id: string): Adr {
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
  };
}

describe("EngineeringWorkspace", () => {
  it("exposes all configured repositories", () => {
    const database = new EngineeringDatabase();
    const workspace = new EngineeringWorkspace(database);

    database.upsert(createRequirement("REQ-001"));
    database.upsert(createComponent("CMP-001"));
    database.upsert(createVerification("VER-001"));
    database.upsert(createRisk("RSK-001"));
    database.upsert(createAdr("ADR-001"));

    expect(workspace.requirements.findById("REQ-001")).toBeDefined();
    expect(workspace.components.findById("CMP-001")).toBeDefined();
    expect(workspace.verifications.findById("VER-001")).toBeDefined();
    expect(workspace.risks.findById("RSK-001")).toBeDefined();
    expect(workspace.adrs.findById("ADR-001")).toBeDefined();
  });

  it("keeps repositories separated by entity type", () => {
    const database = new EngineeringDatabase();
    const workspace = new EngineeringWorkspace(database);

    database.upsert(createRequirement("REQ-001"));
    database.upsert(createComponent("CMP-001"));
    database.upsert(createVerification("VER-001"));
    database.upsert(createRisk("RSK-001"));
    database.upsert(createAdr("ADR-001"));

    expect(workspace.requirements.findAll()).toHaveLength(1);
    expect(workspace.components.findAll()).toHaveLength(1);
    expect(workspace.verifications.findAll()).toHaveLength(1);
    expect(workspace.risks.findAll()).toHaveLength(1);
    expect(workspace.adrs.findAll()).toHaveLength(1);

    expect(workspace.requirements.findById("ADR-001")).toBeUndefined();
    expect(workspace.components.findById("RSK-001")).toBeUndefined();
    expect(workspace.verifications.findById("CMP-001")).toBeUndefined();
    expect(workspace.risks.findById("REQ-001")).toBeUndefined();
    expect(workspace.adrs.findById("VER-001")).toBeUndefined();
  });

  it("reports the total database count", () => {
    const database = new EngineeringDatabase();
    const workspace = new EngineeringWorkspace(database);

    database.upsert(createRequirement("REQ-001"));
    database.upsert(createComponent("CMP-001"));
    database.upsert(createVerification("VER-001"));
    database.upsert(createRisk("RSK-001"));
    database.upsert(createAdr("ADR-001"));

    expect(workspace.count()).toBe(5);
  });

  it("clears the database through the workspace", () => {
    const database = new EngineeringDatabase();
    const workspace = new EngineeringWorkspace(database);

    database.upsert(createRequirement("REQ-001"));
    database.upsert(createComponent("CMP-001"));
    database.upsert(createVerification("VER-001"));
    database.upsert(createRisk("RSK-001"));
    database.upsert(createAdr("ADR-001"));

    workspace.clear();

    expect(workspace.count()).toBe(0);
    expect(workspace.requirements.findAll()).toEqual([]);
    expect(workspace.components.findAll()).toEqual([]);
    expect(workspace.verifications.findAll()).toEqual([]);
    expect(workspace.risks.findAll()).toEqual([]);
    expect(workspace.adrs.findAll()).toEqual([]);
  });
});
