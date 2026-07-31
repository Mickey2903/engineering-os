import { describe, expect, it } from "vitest";

import { TraceabilityRule } from "../../../src/intelligence/rules/TraceabilityRule";
import { mockDatabase } from "../../helpers/mockEngineeringDatabaseReader";


describe("TraceabilityRule", () => {

  it("detects requirements without links", () => {

    const rule =
      new TraceabilityRule();


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

          verificationMethod:
            "test",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "Incomplete traceability",
      );


    expect(insights[0]?.objectId)
      .toBe(
        "REQ-001",
      );
  });


  it("does not report requirements with links", () => {

    const rule =
      new TraceabilityRule();


    const database =
      mockDatabase([
        {
          id: "REQ-002",
          type: "requirement",
          title: "Motor must stop",
          status: "approved",

          tags: [],
          sourcePath: "Requirements/REQ-002.md",

          links: [
            "TEST-001",
          ],

          modifiedTime: Date.now(),
          metadata: {},

          domain: "control",
          priority: "high",

          acceptanceCriteria: [
            "Motor stops",
          ],

          verificationMethod:
            "test",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(0);
  });

});
