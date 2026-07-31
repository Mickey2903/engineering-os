import { describe, expect, it } from "vitest";

import { EngineeringMetricsHistoryService } from "../../src/services/EngineeringMetricsHistoryService";

describe("EngineeringMetricsHistoryService", () => {
  it("stores metric snapshots", () => {
    const service = new EngineeringMetricsHistoryService();

    service.addSnapshot({
      date: "2026-07-31",
      overallScore: 86,
      healthScore: 92,
      requirementQualityScore: 84,
      verificationCoverageScore: 78,
      traceabilityScore: 91,
    });

    expect(service.getHistory()).toHaveLength(1);
    expect(service.latest()?.overallScore).toBe(86);
  });
});
