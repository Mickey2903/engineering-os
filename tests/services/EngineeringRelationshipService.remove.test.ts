import { describe, expect, it } from "vitest";

import { EngineeringRelationshipService } from "../../src/services/EngineeringRelationshipService";

describe("EngineeringRelationshipService remove", () => {
  it("removes all links connected to an object", () => {
    const service =
      new EngineeringRelationshipService();

    service.addLink({
      id: "L1",
      sourceId: "REQ-001",
      targetId: "CPU-001",
      type: "implements",
      createdAt: "2026-07-31",
    });

    service.addLink({
      id: "L2",
      sourceId: "CPU-001",
      targetId: "TEST-001",
      type: "verifies",
      createdAt: "2026-07-31",
    });

    service.removeLinksForObject("CPU-001");

    expect(service.getLinks()).toHaveLength(0);
  });
});
