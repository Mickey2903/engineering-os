import { describe, expect, it } from "vitest";

import { EngineeringTrendService } from "../../src/services/EngineeringTrendService";

describe("EngineeringTrendService", () => {
  it("detects improving trend", () => {
    const service = new EngineeringTrendService();

    const report = service.analyze([
      {
        date: "2026-07-31",
        overallScore: 70,
        healthScore: 70,
        requirementQualityScore: 70,
        verificationCoverageScore: 70,
        traceabilityScore: 70,
      },
      {
        date: "2026-08-31",
        overallScore: 85,
        healthScore: 80,
        requirementQualityScore: 85,
        verificationCoverageScore: 90,
        traceabilityScore: 85,
      },
    ]);

    expect(report.direction).toBe("improving");
    expect(report.scoreChange).toBe(15);
    expect(report.strongestMetric).toBe("Verification Coverage");
  });

  it("detects declining trend", () => {
    const service = new EngineeringTrendService();

    const report = service.analyze([
      {
        date: "2026-07-31",
        overallScore: 90,
        healthScore: 90,
        requirementQualityScore: 90,
        verificationCoverageScore: 90,
        traceabilityScore: 90,
      },
      {
        date: "2026-08-31",
        overallScore: 75,
        healthScore: 75,
        requirementQualityScore: 75,
        verificationCoverageScore: 75,
        traceabilityScore: 75,
      },
    ]);

    expect(report.direction).toBe("declining");
  });

  it("detects stable trend", () => {
    const service = new EngineeringTrendService();

    const report = service.analyze([
      {
        date: "2026-07-31",
        overallScore: 80,
        healthScore: 80,
        requirementQualityScore: 80,
        verificationCoverageScore: 80,
        traceabilityScore: 80,
      },
      {
        date: "2026-08-31",
        overallScore: 80,
        healthScore: 80,
        requirementQualityScore: 80,
        verificationCoverageScore: 80,
        traceabilityScore: 80,
      },
    ]);

    expect(report.direction).toBe("stable");
  });
});
