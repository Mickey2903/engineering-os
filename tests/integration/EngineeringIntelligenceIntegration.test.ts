import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { MetadataParser } from "../../src/parser/MetadataParser";

import { EngineeringIntelligenceEngine } from "../../src/intelligence/EngineeringIntelligenceEngine";

import { RequirementQualityRule } from "../../src/intelligence/rules/RequirementQualityRule";
import { VerificationCoverageRule } from "../../src/intelligence/rules/VerificationCoverageRule";
import { ComponentHealthRule } from "../../src/intelligence/rules/ComponentHealthRule";
import { RiskHealthRule } from "../../src/intelligence/rules/RiskHealthRule";
import { ArchitectureHealthRule } from "../../src/intelligence/rules/ArchitectureHealthRule";

import {
  createFile,
  createMetadata,
} from "../helpers/ObsidianTestFactory";


describe("Engineering intelligence integration", () => {

  it("analyses a complete engineering workspace", () => {

    const database =
      new EngineeringDatabase();


    const parser =
      new MetadataParser();


    const files = [
      [
        "Requirements/REQ-001.md",
        {
          id: "REQ-001",
          title: "Motor must stop",
          type: "requirement",
          status: "approved",
          domain: "control",
          priority: "high",
          acceptanceCriteria: [
            "Motor stops",
          ],
        },
      ],

      [
        "Components/COMP-001.md",
        {
          id: "COMP-001",
          title: "Motor Controller",
          type: "component",
          status: "active",
          lifecycle: "unknown",
        },
      ],

      [
        "Risks/RISK-001.md",
        {
          id: "RISK-001",
          title: "Motor failure",
          type: "risk",
          status: "active",
          level: "high",
          riskState: "open",
          owner: "Engineering",
        },
      ],

      [
        "Verification/TEST-001.md",
        {
          id: "TEST-001",
          title: "Motor stop test",
          type: "verification",
          status: "verified",
          method: "test",
          requirementIds: [
            "REQ-001",
          ],
          result: "passed",
        },
      ],
    ] as const;


    for (const [path, metadata] of files) {

      const entity =
        parser.parse(
          createFile(path),
          createMetadata(metadata),
        );

      database.upsert(entity);
    }


    const engine =
      new EngineeringIntelligenceEngine([
        new RequirementQualityRule(),
        new VerificationCoverageRule(),
        new ComponentHealthRule(),
        new RiskHealthRule(),
        new ArchitectureHealthRule(),
      ]);


    const insights =
      engine.analyze(database);


    expect(insights.length)
      .toBeGreaterThan(0);


    expect(
      insights.some(
        (item) =>
          item.title ===
          "Missing verification method",
      ),
    ).toBe(true);


    expect(
      insights.some(
        (item) =>
          item.title ===
          "High risk without mitigation",
      ),
    ).toBe(true);


    expect(
      insights.some(
        (item) =>
          item.title ===
          "Missing component lifecycle",
      ),
    ).toBe(true);
  });

});
