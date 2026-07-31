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
      missingComponents: [],
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
    missingComponents: [],
  };

  const renderer = new TraceabilityRenderer();

  const markdown = renderer.render(snapshot);

  expect(markdown).toContain("Requirements: **12**");
});

it("renders the traced requirement count", () => {
  const snapshot = {
    requirementCount: 12,
    tracedRequirementCount: 9,
    missingComponentCount: 2,
    missingVerificationCount: 1,
    missingComponents: [],
  };

  const renderer = new TraceabilityRenderer();

  const markdown = renderer.render(snapshot);

  expect(markdown).toContain("Traced requirements: **9**");
});

it("renders the missing component count", () => {
  const snapshot = {
    requirementCount: 12,
    tracedRequirementCount: 9,
    missingComponentCount: 2,
    missingVerificationCount: 1,
    missingComponents: [],
  };

  const renderer = new TraceabilityRenderer();

  const markdown = renderer.render(snapshot);

  expect(markdown).toContain("Missing components: **2**");
});

it("renders the missing verification count", () => {
  const snapshot = {
    requirementCount: 12,
    tracedRequirementCount: 9,
    missingComponentCount: 2,
    missingVerificationCount: 1,
    missingComponents: [],
  };

  const renderer = new TraceabilityRenderer();

  const markdown = renderer.render(snapshot);

  expect(markdown).toContain("Missing verifications: **1**");
});

it("renders the coverage percentage", () => {
  const snapshot = {
    requirementCount: 8,
    tracedRequirementCount: 6,
    missingComponentCount: 1,
    missingVerificationCount: 1,
    missingComponents: [],
  };

  const renderer = new TraceabilityRenderer();

  const markdown = renderer.render(snapshot);

  expect(markdown).toContain("Coverage: **75%**");
});

it("renders requirements without components", () => {
  const snapshot: TraceabilitySnapshot = {
    requirementCount: 2,
    tracedRequirementCount: 1,
    missingComponentCount: 1,
    missingVerificationCount: 0,
    missingComponents: [
      {
        id: "REQ-002",
        type: "requirement",
        title: "Emergency stop",
        status: "approved",
        tags: [],
        sourcePath: "Requirements/REQ-002.md",
        links: [],
        modifiedTime: 1,
        metadata: {},
        domain: "safety",
        priority: "critical",
        acceptanceCriteria: [],
      },
    ],
  };

  const renderer = new TraceabilityRenderer();

  const markdown = renderer.render(snapshot);

  expect(markdown).toContain("## Requirements without components");
  expect(markdown).toContain("- REQ-002 – Emergency stop");
});

it("renders the complete report", () => {
  const snapshot: TraceabilitySnapshot = {
    requirementCount: 2,
    tracedRequirementCount: 1,
    missingComponentCount: 1,
    missingVerificationCount: 1,
    missingComponents: [
      {
        id: "REQ-002",
        type: "requirement",
        title: "Emergency stop",
        status: "approved",
        tags: [],
        sourcePath: "Requirements/REQ-002.md",
        links: [],
        modifiedTime: 1,
        metadata: {},
        domain: "safety",
        priority: "critical",
        acceptanceCriteria: [],
      },
    ],
  };

  const renderer = new TraceabilityRenderer();

  expect(renderer.render(snapshot)).toBe(
    [
      "# Traceability Report",
      "",
      "Requirements: **2**",
      "Traced requirements: **1**",
      "Missing components: **1**",
      "Missing verifications: **1**",
      "Coverage: **50%**",
      "",
      "## Requirements without components",
      "",
      "- REQ-002 – Emergency stop",
      "",
    ].join("\n"),
  );
});
