import { describe, expect, it } from "vitest";
import type { DashboardSnapshot } from "../../src/models/DashboardSnapshot";

describe("DashboardSnapshot", () => {
  it("can represent an empty engineering project", () => {
    const snapshot: DashboardSnapshot = {
      requirementCount: 0,
      componentCount: 0,
      verificationCount: 0,
      riskCount: 0,
      adrCount: 0,

      brokenLinks: 0,
      orphanRequirements: 0,
      duplicateRelationships: 0,
    };

    expect(snapshot.requirementCount).toBe(0);
    expect(snapshot.componentCount).toBe(0);
    expect(snapshot.verificationCount).toBe(0);
    expect(snapshot.riskCount).toBe(0);
    expect(snapshot.adrCount).toBe(0);

    expect(snapshot.brokenLinks).toBe(0);
    expect(snapshot.orphanRequirements).toBe(0);
    expect(snapshot.duplicateRelationships).toBe(0);
  });
});
