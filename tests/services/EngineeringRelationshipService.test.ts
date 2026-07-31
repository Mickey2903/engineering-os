import { describe, expect, it } from "vitest";

import { EngineeringRelationshipService } from "../../src/services/EngineeringRelationshipService";

describe("EngineeringRelationshipService", () => {
  it("finds impacted engineering objects", () => {
    const service = new EngineeringRelationshipService();

    service.addLink({
      id: "L1",
      sourceId: "REQ-001",
      targetId: "COMP-001",
      type: "implements",
      createdAt: "2026-07-31",
    });

    service.addLink({
      id: "L2",
      sourceId: "COMP-001",
      targetId: "TEST-001",
      type: "verifies",
      createdAt: "2026-07-31",
    });

    expect(service.findImpact("REQ-001"))
      .toContain("TEST-001");
  });
});
