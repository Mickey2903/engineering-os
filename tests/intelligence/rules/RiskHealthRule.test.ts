import { describe, expect, it } from "vitest";

import { RiskHealthRule } from "../../../src/intelligence/rules/RiskHealthRule";
import { mockDatabase } from "../../helpers/mockEngineeringDatabaseReader";


describe("RiskHealthRule", () => {

  it("detects high risk without mitigation", () => {

    const rule =
      new RiskHealthRule();


    const database =
      mockDatabase([
        {
          id: "RISK-001",
          type: "risk",
          title: "Motor failure",

          status: "active",
          tags: [],

          sourcePath:
            "Risks/RISK-001.md",

          links: [],

          modifiedTime: Date.now(),
          metadata: {},

          level:
            "high",

          riskState:
            "open",

          owner:
            "Michael",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "High risk without mitigation",
      );


    expect(insights[0]?.objectId)
      .toBe(
        "RISK-001",
      );
  });


  it("detects open risk without owner", () => {

    const rule =
      new RiskHealthRule();


    const database =
      mockDatabase([
        {
          id: "RISK-002",
          type: "risk",
          title: "Communication failure",

          status: "active",
          tags: [],

          sourcePath:
            "Risks/RISK-002.md",

          links: [],

          modifiedTime: Date.now(),
          metadata: {},

          level:
            "medium",

          riskState:
            "open",

          mitigation:
            "Add monitoring",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "Open risk without owner",
      );
  });


  it("does not report healthy risks", () => {

    const rule =
      new RiskHealthRule();


    const database =
      mockDatabase([
        {
          id: "RISK-003",
          type: "risk",
          title: "Minor issue",

          status: "active",
          tags: [],

          sourcePath:
            "Risks/RISK-003.md",

          links: [],

          modifiedTime: Date.now(),
          metadata: {},

          level:
            "low",

          riskState:
            "accepted",

          owner:
            "Engineering",

          mitigation:
            "Monitor during testing",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(0);
  });


  it("detects unknown risk level", () => {

    const rule =
      new RiskHealthRule();


    const database =
      mockDatabase([
        {
          id: "RISK-004",
          type: "risk",
          title: "Unknown risk",

          status: "draft",
          tags: [],

          sourcePath:
            "Risks/RISK-004.md",

          links: [],

          modifiedTime: Date.now(),
          metadata: {},

          level:
            "unknown",

          riskState:
            "unknown",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "Unknown risk level",
      );
  });

});
