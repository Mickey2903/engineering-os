import { describe, expect, it } from "vitest";

import { EngineeringIntelligenceEngine } from "../../src/intelligence/EngineeringIntelligenceEngine";

import type { EngineeringRule } from "../../src/intelligence/EngineeringRule";
import type { EngineeringInsight } from "../../src/intelligence/EngineeringInsight";
import { mockDatabase } from "../helpers/mockEngineeringDatabaseReader";

describe("EngineeringIntelligenceEngine", () => {
  it("combines insights from multiple rules", () => {
    const firstInsight: EngineeringInsight = {
      id: "INSIGHT-001",
      severity: "warning",
      title: "Missing verification method",
      description: "Requirement has no verification method.",
      objectId: "REQ-001",
    };

    const secondInsight: EngineeringInsight = {
      id: "INSIGHT-002",
      severity: "critical",
      title: "Missing traceability",
      description: "Component has no linked requirement.",
      objectId: "COMP-001",
    };

    const ruleOne: EngineeringRule = {
      id: "rule-one",
      name: "Rule one",

      evaluate: () => [
        firstInsight,
      ],
    };

    const ruleTwo: EngineeringRule = {
      id: "rule-two",
      name: "Rule two",

      evaluate: () => [
        secondInsight,
      ],
    };

    const engine =
      new EngineeringIntelligenceEngine([
        ruleOne,
        ruleTwo,
      ]);

    const database = mockDatabase();

    const result =
      engine.analyze(database);

    expect(result)
      .toHaveLength(2);

    expect(result[0])
      .toEqual(firstInsight);

    expect(result[1])
      .toEqual(secondInsight);
  });


  it("returns an empty list when no rules generate insights", () => {
    const rule: EngineeringRule = {
      id: "empty-rule",
      name: "Empty rule",

      evaluate: () => [],
    };

    const engine =
      new EngineeringIntelligenceEngine([
        rule,
      ]);

    const database = mockDatabase();

    const result =
      engine.analyze(database);

    expect(result)
      .toHaveLength(0);
  });
});
