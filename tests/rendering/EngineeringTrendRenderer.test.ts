import { describe, expect, it } from "vitest";

import { EngineeringTrendRenderer } from "../../src/rendering/EngineeringTrendRenderer";

describe("EngineeringTrendRenderer", () => {
  it("renders engineering trend report", () => {
    const renderer = new EngineeringTrendRenderer();

    const markdown = renderer.render(
      {
        currentScore: 93,
        previousScore: 86,
        scoreChange: 7,
        direction: "improving",
        strongestMetric: "Verification Coverage",
      },
      [
        {
          date: "2026-07-31",
          overallScore: 86,
          healthScore: 90,
          requirementQualityScore: 80,
          verificationCoverageScore: 78,
          traceabilityScore: 85,
        },
        {
          date: "2026-08-31",
          overallScore: 93,
          healthScore: 95,
          requirementQualityScore: 90,
          verificationCoverageScore: 95,
          traceabilityScore: 92,
        },
      ],
    );

    expect(markdown).toContain("# Engineering Trend Report");
    expect(markdown).toContain("Score: **93%**");
    expect(markdown).toContain("Verification Coverage");
    expect(markdown).toContain("2026-08-31: 93%");
  });
});
