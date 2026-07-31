import { describe, expect, it } from "vitest";

import { RequirementQualityRule } from "../../../src/intelligence/rules/RequirementQualityRule";
import { mockDatabase } from "../../helpers/mockEngineeringDatabaseReader";

describe("RequirementQualityRule", () => {
  it("detects missing verification method", () => {
    const rule =
      new RequirementQualityRule();

    const database = mockDatabase([
  {
    id: "REQ-001",
    type: "requirement",
    title: "Motor must stop",
    status: "approved",
    tags: [],
    sourcePath: "Requirements/REQ-001.md",
    links: [],
    modifiedTime: Date.now(),
    metadata: {},

    domain: "control",
    priority: "high",
    acceptanceCriteria: [
      "Motor stops within 2 seconds",
    ],
  },
]);

    const insights =
      rule.evaluate(database);

    expect(insights).toHaveLength(1);

    expect(insights[0]?.title)
      .toBe("Missing verification method");

    expect(insights[0]?.objectId)
      .toBe("REQ-001");
  });


  it("detects missing acceptance criteria", () => {
    const rule =
      new RequirementQualityRule();

 const database = mockDatabase([
  {
    id: "REQ-002",
    type: "requirement",
    title: "System shall start",
    status: "draft",
    tags: [],
    sourcePath: "Requirements/REQ-002.md",
    links: [],
    modifiedTime: Date.now(),
    metadata: {},

    domain: "system",
    priority: "medium",
    acceptanceCriteria: [],
    verificationMethod: "test",
  },
]);

    const insights =
      rule.evaluate(database);

    expect(insights).toHaveLength(1);

    expect(insights[0]?.title)
      .toBe("Missing acceptance criteria");

    expect(insights[0]?.objectId)
      .toBe("REQ-002");
  });


  it("does not report complete requirements", () => {
    const rule =
      new RequirementQualityRule();

    const database = mockDatabase([
  {
    id: "REQ-003",
    type: "requirement",
    title: "System shall boot",
    status: "approved",
    tags: [],
    sourcePath: "Requirements/REQ-003.md",
    links: [],
    modifiedTime: Date.now(),
    metadata: {},

    domain: "system",
    priority: "high",
    acceptanceCriteria: [
      "System boots successfully",
    ],

    verificationMethod: "test",
  },
]);

    const insights =
      rule.evaluate(database);

    expect(insights).toHaveLength(0);
  });
});
