import { describe, expect, it } from "vitest";

import type { EngineeringObjectReference } from "../../src/models/EngineeringObjectReference";

describe("EngineeringObjectReference", () => {
  it("stores engineering object references", () => {
    const reference: EngineeringObjectReference = {
      objectId: "REQ-001",
      objectType: "requirement",
      sourcePath: "Engineering/Requirements/REQ-001.md",
      title: "Emergency stop requirement",
    };

    expect(reference.objectId).toBe("REQ-001");
    expect(reference.objectType).toBe("requirement");
    expect(reference.sourcePath).toContain("REQ-001");
  });
});
