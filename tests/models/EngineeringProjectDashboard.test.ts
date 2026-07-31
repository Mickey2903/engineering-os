import { describe, expect, it } from "vitest";

import type { EngineeringProjectDashboard } from "../../src/models/EngineeringProjectDashboard";

describe("EngineeringProjectDashboard", () => {
  it("stores project engineering metrics", () => {
    const dashboard: EngineeringProjectDashboard = {
      projectId: "ROBOT-001",
      projectName: "Mars Rover",

      requirementCount: 42,
      componentCount: 18,
      verificationCount: 35,
      riskCount: 6,
      adrCount: 12,

      requirementQualityScore: 91,
      verificationCoverageScore: 84,
      traceabilityScore: 88,
      healthScore: 90,
    };

    expect(dashboard.projectId)
      .toBe("ROBOT-001");

    expect(dashboard.requirementCount)
      .toBe(42);

    expect(dashboard.healthScore)
      .toBe(90);
  });
});
