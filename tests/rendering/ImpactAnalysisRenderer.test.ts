import { describe, expect, it } from "vitest";

import { ImpactAnalysisRenderer } from "../../src/rendering/ImpactAnalysisRenderer";


describe("ImpactAnalysisRenderer", () => {

  it("renders an impact analysis report", () => {

    const renderer =
      new ImpactAnalysisRenderer();


    const markdown =
      renderer.render({
        rootObjectId: "CMP-001",

        affectedObjects: [
          "REQ-001",
          "TEST-001",
        ],

        affectedComponents: [
          "CMP-002",
        ],

        affectedRequirements: [
          "REQ-001",
        ],

        affectedTests: [
          "TEST-001",
        ],
      });


    expect(markdown)
      .toContain(
        "Impact Analysis Report",
      );


    expect(markdown)
      .toContain(
        "CMP-001",
      );


    expect(markdown)
      .toContain(
        "REQ-001",
      );


    expect(markdown)
      .toContain(
        "CMP-002",
      );


    expect(markdown)
      .toContain(
        "TEST-001",
      );

  });

});
