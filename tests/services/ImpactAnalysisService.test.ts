import { describe, expect, it } from "vitest";

import { ImpactAnalysisService } from "../../src/services/ImpactAnalysisService";
import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { EngineeringRelationshipService } from "../../src/services/EngineeringRelationshipService";

describe("ImpactAnalysisService", () => {
  it("creates impact report from relationships", () => {
    const relationships =
      new EngineeringRelationshipService();
      const database =
  new EngineeringDatabase();

    relationships.addLink({
      id: "L1",
      sourceId: "REQ-001",
      targetId: "COMP-001",
      type: "implements",
      createdAt: "2026-07-31",
    });

    relationships.addLink({
      id: "L2",
      sourceId: "COMP-001",
      targetId: "TEST-001",
      type: "verifies",
      createdAt: "2026-07-31",
    });

    const service =
  new ImpactAnalysisService(
    relationships,
    database,
  );

    const report =
      service.analyze("REQ-001");

    expect(report.affectedObjects)
      .toContain("TEST-001");
  });
});
