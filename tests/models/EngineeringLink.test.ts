import { describe, expect, it } from "vitest";

import type { EngineeringLink } from "../../src/models/EngineeringLink";

describe("EngineeringLink", () => {
  it("stores engineering relationships", () => {
    const link: EngineeringLink = {
      id: "LINK-001",
      sourceId: "REQ-001",
      targetId: "COMP-001",
      type: "implements",
      description: "Requirement implemented by controller module",
      createdAt: "2026-07-31",
    };

    expect(link.sourceId).toBe("REQ-001");
    expect(link.targetId).toBe("COMP-001");
    expect(link.type).toBe("implements");
  });
});
