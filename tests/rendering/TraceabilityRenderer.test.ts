import { describe, expect, it } from "vitest";

import type { TraceabilitySnapshot } from "../../src/models/TraceabilitySnapshot";
import { TraceabilityRenderer } from "../../src/rendering/TraceabilityRenderer";

describe("TraceabilityRenderer", () => {
  it("renders the report heading", () => {
    const snapshot: TraceabilitySnapshot = {
      requirementCount: 0,
      tracedRequirementCount: 0,
      missingComponentCount: 0,
      missingVerificationCount: 0,
    };

    const renderer = new TraceabilityRenderer();

    expect(renderer.render(snapshot)).toContain("# Traceability Report");
  });
});

it("renders the requirement count", () => {
  const snapshot = {
    requirementCount: 12,
    tracedRequirementCount: 10,
    missingComponentCount: 1,
    missingVerificationCount: 1,
  };

  const renderer = new TraceabilityRenderer();

  const markdown = renderer.render(snapshot);

  expect(markdown).toContain("Requirements: **12**");
});
