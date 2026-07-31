import { describe, expect, it } from "vitest";

import type { RequirementQualityReport } from "../../src/models/RequirementQualityReport";

describe("RequirementQualityReport", () => {
  it("stores requirement quality metrics", () => {
    const report: RequirementQualityReport = {
      requirementCount: 2,
      averageScore: 75,
      entries: [
        {
          requirementId: "REQ-001",
          title: "Emergency stop",
          score: 50,
          issues: [],
        },
      ],
    };

    expect(report.requirementCount).toBe(2);
    expect(report.averageScore).toBe(75);
    expect(report.entries.length).toBe(1);
  });
});
