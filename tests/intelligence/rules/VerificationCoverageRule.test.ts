import { describe, expect, it } from "vitest";

import { VerificationCoverageRule } from "../../../src/intelligence/rules/VerificationCoverageRule";
import { mockDatabase } from "../../helpers/mockEngineeringDatabaseReader";


describe("VerificationCoverageRule", () => {

  it("detects requirements without verification", () => {

    const rule =
      new VerificationCoverageRule();


    const database =
      mockDatabase([
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
            "Motor stops",
          ],
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "Missing verification coverage",
      );

    expect(insights[0]?.objectId)
      .toBe(
        "REQ-001",
      );
  });


  it("does not report verified requirements", () => {

    const rule =
      new VerificationCoverageRule();


    const database =
      mockDatabase([
        {
          id: "REQ-002",
          type: "requirement",
          title: "Motor must stop",

          status: "approved",
          tags: [],
          sourcePath: "Requirements/REQ-002.md",
          links: [],

          modifiedTime: Date.now(),
          metadata: {},

          domain: "control",
          priority: "high",

          acceptanceCriteria: [
            "Motor stops",
          ],
        },

        {
          id: "TEST-001",
          type: "verification",
          title: "Motor stop test",

          status: "verified",
          tags: [],
          sourcePath: "Verification/TEST-001.md",
          links: [],

          modifiedTime: Date.now(),
          metadata: {},

          method: "test",

          requirementIds: [
            "REQ-002",
          ],

          result: "passed",
        },
      ]);
console.log(database.findByType("verification"));

    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(0);
  });

});
