import { describe, expect, it } from "vitest";

import { ImpactAnalysisRenderer } from "../../src/rendering/ImpactAnalysisRenderer";

describe("ImpactAnalysisRenderer", () => {
  it("renders impact analysis report", () => {
    const renderer =
      new ImpactAnalysisRenderer();

    const markdown =
      renderer.render({
        rootObjectId: "REQ-001",
        affectedObjects: [
          "CPU-001",
          "TEST-001",
        ],
        affectedComponents: [
          "CPU-001",
        ],
        affectedRequirements: [],
        affectedTests: [
          "TEST-001",
        ],
      });

    expect(markdown)
      .toContain("# Impact Analysis Report");

    expect(markdown)
      .toContain("REQ-001");

    expect(markdown)
      .toContain("CPU-001");

    expect(markdown)
      .toContain("TEST-001");
  });
});
