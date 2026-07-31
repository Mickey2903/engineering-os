import { describe, expect, it } from "vitest";

import { VerificationCoverageRenderer } from "../../src/rendering/VerificationCoverageRenderer";

describe("VerificationCoverageRenderer", () => {
  it("renders verification coverage report", () => {
    const renderer = new VerificationCoverageRenderer();

    const markdown = renderer.render({
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
    });

    expect(markdown).toContain("# Verification Coverage Report");
    expect(markdown).toContain("Coverage: **80%**");
    expect(markdown).toContain("- REQ-001 – Emergency stop");
  });
});
