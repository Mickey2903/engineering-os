import { describe, expect, it } from "vitest";

import type { VerificationTraceabilityEntry } from "../../src/models/VerificationTraceabilityEntry";

describe("VerificationTraceabilityEntry", () => {
  it("stores verification traceability information", () => {
    const entry: VerificationTraceabilityEntry = {
      requirementId: "REQ-001",
      componentIds: [
        "CPU-001",
      ],
      verificationIds: [
        "TEST-001",
      ],
      status: "verified",
    };

    expect(entry.requirementId)
      .toBe("REQ-001");

    expect(entry.status)
      .toBe("verified");

    expect(entry.verificationIds)
      .toContain("TEST-001");
  });
});
