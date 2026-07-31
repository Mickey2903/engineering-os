import { describe, expect, it } from "vitest";

import type { TraceabilitySnapshot } from "../../src/models/TraceabilitySnapshot";

describe("TraceabilitySnapshot", () => {
  it("stores traceability metrics", () => {
    const snapshot: TraceabilitySnapshot = {
      requirementCount: 10,
      tracedRequirementCount: 8,
      missingComponentCount: 1,
      missingVerificationCount: 1,
    };

    expect(snapshot.requirementCount).toBe(10);
    expect(snapshot.tracedRequirementCount).toBe(8);
    expect(snapshot.missingComponentCount).toBe(1);
    expect(snapshot.missingVerificationCount).toBe(1);
  });
});
