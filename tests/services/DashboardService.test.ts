import { describe, expect, it } from "vitest";
import { DashboardService } from "../../src/services/DashboardService";

describe("DashboardService", () => {
  it("creates an empty dashboard snapshot", () => {
    const service = new DashboardService({
      getRequirements: () => [],
      getComponents: () => [],
      getVerifications: () => [],
      getRisks: () => [],
      getAdrs: () => [],
    });

    expect(service.createSnapshot()).toEqual({
      requirementCount: 0,
      componentCount: 0,
      verificationCount: 0,
      riskCount: 0,
      adrCount: 0,
      brokenLinks: 0,
      orphanRequirements: 0,
      duplicateRelationships: 0,
    });
  });

  it("counts engineering entities from the data source", () => {
    const service = new DashboardService({
      getRequirements: () => [{}, {}, {}],
      getComponents: () => [{}, {}],
      getVerifications: () => [{}],
      getRisks: () => [{}, {}, {}, {}],
      getAdrs: () => [{}, {}],
    });

    expect(service.createSnapshot()).toMatchObject({
      requirementCount: 3,
      componentCount: 2,
      verificationCount: 1,
      riskCount: 4,
      adrCount: 2,
    });
  });

  it("includes engineering health metrics", () => {
    const service = new DashboardService(
      {
        getRequirements: () => [],
        getComponents: () => [],
        getVerifications: () => [],
        getRisks: () => [],
        getAdrs: () => [],
      },
      {
        getBrokenLinkCount: () => 3,
        getOrphanRequirementCount: () => 2,
        getDuplicateRelationshipCount: () => 1,
      },
    );

    expect(service.createSnapshot()).toMatchObject({
      brokenLinks: 3,
      orphanRequirements: 2,
      duplicateRelationships: 1,
    });
  });
});
