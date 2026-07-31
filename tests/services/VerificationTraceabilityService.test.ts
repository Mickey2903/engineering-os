import { describe, expect, it } from "vitest";

import { VerificationTraceabilityService } from "../../src/services/VerificationTraceabilityService";
import { EngineeringRelationshipService } from "../../src/services/EngineeringRelationshipService";

describe("VerificationTraceabilityService", () => {
  it("creates requirement verification matrix", () => {
    const relationships =
      new EngineeringRelationshipService();

    relationships.addLink({
      id: "L1",
      sourceId: "REQ-001",
      targetId: "CPU-001",
      type: "implements",
      createdAt: "2026-07-31",
    });

    relationships.addLink({
      id: "L2",
      sourceId: "CPU-001",
      targetId: "TEST-001",
      type: "verifies",
      createdAt: "2026-07-31",
    });

    const service =
      new VerificationTraceabilityService(
        relationships,
      );

    const result =
      service.analyze([
        "REQ-001",
      ]);

    expect(result[0]?.status)
      .toBe("verified");

    expect(result[0]?.verificationIds)
      .toContain("TEST-001");
  });
});
