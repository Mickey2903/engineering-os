import { describe, expect, it } from "vitest";

import type { VerificationCoverageReport } from "../../src/models/VerificationCoverageReport";

describe("VerificationCoverageReport", () => {
  it("stores verification coverage metrics", () => {
    const report: VerificationCoverageReport = {
      requirementCount: 10,
      verifiedRequirementCount: 8,
      missingVerificationCount: 2,
      coveragePercentage: 80,
      missingVerifications: [
        {
          requirementId: "REQ-001",
          title: "Emergency stop",
        },
      ],
    };

    expect(report.requirementCount).toBe(10);
    expect(report.verifiedRequirementCount).toBe(8);
    expect(report.coveragePercentage).toBe(80);
    expect(report.missingVerifications.length).toBe(1);
  });
});
