import { describe, expect, it } from "vitest";

import { EngineeringIntelligenceRenderer } from "../../src/rendering/EngineeringIntelligenceRenderer";

describe("EngineeringIntelligenceRenderer", () => {
  it("renders intelligence dashboard", () => {
    const renderer = new EngineeringIntelligenceRenderer();

    const markdown = renderer.render({
      overallScore: 86,
      healthScore: 92,
      requirementQualityScore: 84,
      verificationCoverageScore: 78,
      traceabilityScore: 91,
      improvementAreas: [
        {
          category: "verification",
          message: "Verification coverage needs improvement.",
          severity: "high",
        },
      ],
    });

    expect(markdown).toContain("# Engineering Intelligence Dashboard");
    expect(markdown).toContain("Score: **86%**");
    expect(markdown).toContain("Health: **92%**");
    expect(markdown).toContain(
      "- verification - Verification coverage needs improvement.",
    );
  });

  it("renders without improvement areas", () => {
    const renderer = new EngineeringIntelligenceRenderer();

    const markdown = renderer.render({
      overallScore: 100,
      healthScore: 100,
      requirementQualityScore: 100,
      verificationCoverageScore: 100,
      traceabilityScore: 100,
      improvementAreas: [],
    });

    expect(markdown).toContain("Score: **100%**");
    expect(markdown).not.toContain("Improvement Areas");
  });
});
