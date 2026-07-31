import { describe, expect, it } from "vitest";

import type { Requirement } from "../../src/models/Requirement";
import type { TraceabilitySnapshot } from "../../src/models/TraceabilitySnapshot";

describe("TraceabilitySnapshot", () => {
  it("stores traceability metrics", () => {
    const requirement: Requirement = {
      id: "REQ-001",
      type: "requirement",
      title: "Emergency stop",
      status: "approved",
      tags: [],
      sourcePath: "Engineering/Requirements/REQ-001.md",
      links: [],
      modifiedTime: 0,
      metadata: {},
      domain: "safety",
      priority: "critical",
      acceptanceCriteria: [],
    };

    const snapshot: TraceabilitySnapshot = {
      requirementCount: 10,
      tracedRequirementCount: 8,
      missingComponentCount: 1,
      missingVerificationCount: 1,
      missingComponents: [requirement],
    };

    expect(snapshot.requirementCount).toBe(10);
    expect(snapshot.tracedRequirementCount).toBe(8);
    expect(snapshot.missingComponentCount).toBe(1);
    expect(snapshot.missingVerificationCount).toBe(1);
    expect(snapshot.missingComponents).toEqual([requirement]);
  });
});
