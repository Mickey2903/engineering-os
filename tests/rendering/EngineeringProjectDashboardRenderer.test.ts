import { describe, expect, it } from "vitest";

import { EngineeringProjectDashboardRenderer } from "../../src/rendering/EngineeringProjectDashboardRenderer";

describe("EngineeringProjectDashboardRenderer", () => {
  it("renders a project dashboard markdown report", () => {
    const renderer =
      new EngineeringProjectDashboardRenderer();

    const output =
      renderer.render({
        projectId: "PLC-001",
        projectName: "PLC Controller",

        requirementCount: 50,
        componentCount: 20,
        verificationCount: 40,
        riskCount: 5,
        adrCount: 10,

        requirementQualityScore: 90,
        verificationCoverageScore: 85,
        traceabilityScore: 95,
        healthScore: 92,
      });

    expect(output)
      .toContain("# PLC Controller Dashboard");

    expect(output)
      .toContain("Requirement Quality");

    expect(output)
      .toContain("90%");
  });
});
