import { describe, expect, it } from "vitest";

import type { ImpactAnalysisReport } from "../../src/models/ImpactAnalysisReport";

describe("ImpactAnalysisReport", () => {
  it("stores impact analysis results", () => {
    const report: ImpactAnalysisReport = {
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
    };

    expect(report.rootObjectId)
      .toBe("REQ-001");

    expect(report.affectedComponents)
      .toContain("CPU-001");

    expect(report.affectedTests)
      .toContain("TEST-001");
  });
});
