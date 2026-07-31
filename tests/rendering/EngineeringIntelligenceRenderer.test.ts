import { describe, expect, it } from "vitest";

import { EngineeringIntelligenceRenderer } from "../../src/rendering/EngineeringIntelligenceRenderer";


describe("EngineeringIntelligenceRenderer", () => {
  it("renders intelligence dashboard with insights", () => {

    const renderer =
      new EngineeringIntelligenceRenderer();


    const output =
      renderer.render({
        overallScore: 85,

        healthScore: 90,
        requirementQualityScore: 80,
        verificationCoverageScore: 85,
        traceabilityScore: 95,

        improvementAreas: [
          {
            category: "verification",
            message: "Verification coverage needs improvement.",
            severity: "medium",
          },
        ],

        insights: [
          {
            id: "RISK-001-mitigation",
            objectId: "RISK-001",
            severity: "critical",
            title: "High risk without mitigation",
            description:
              "Risk RISK-001 has no mitigation plan.",
            recommendation:
              "Create a mitigation plan.",
          },
        ],
      });


    expect(output)
      .toContain(
        "# Engineering Intelligence Dashboard",
      );


    expect(output)
      .toContain(
        "Score: **85%**",
      );


    expect(output)
      .toContain(
        "Requirement Quality",
      );


    expect(output)
      .toContain(
        "Improvement Areas",
      );


    expect(output)
      .toContain(
        "Intelligence Findings",
      );


    expect(output)
      .toContain(
        "High risk without mitigation",
      );
  });
});
