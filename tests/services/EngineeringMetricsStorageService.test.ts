import { describe, expect, it } from "vitest";

import { EngineeringMetricsStorageService } from "../../src/services/EngineeringMetricsStorageService";

describe("EngineeringMetricsStorageService", () => {
  it("stores and loads metric history", async () => {
    let stored = "";

    const service = new EngineeringMetricsStorageService({
      read: async () => {
        await Promise.resolve();
        return stored;
      },
      write: async (content) => {
        await Promise.resolve();
        stored = content;
      },
    });

    await service.save([
      {
        date: "2026-07-31",
        overallScore: 86,
        healthScore: 92,
        requirementQualityScore: 84,
        verificationCoverageScore: 78,
        traceabilityScore: 91,
      },
    ]);

    const history = await service.load();

    expect(history).toHaveLength(1);
    expect(history[0]?.overallScore).toBe(86);
  });
});
