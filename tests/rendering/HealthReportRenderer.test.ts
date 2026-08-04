import { describe, expect, it } from "vitest";

import { renderHealthReport } from "../../src/rendering/HealthReportRenderer";

describe("renderHealthReport", () => {
it("renders an empty health report", () => {
  const markdown = renderHealthReport({
    brokenLinks: [],
    orphanEntities: [],
    entitiesWithoutIncomingLinks: [],
    entitiesWithoutOutgoingLinks: [],
    duplicateRelationships: [],
  });


  expect(markdown)
    .toContain(
      "# Engineering Health Report",
    );


  expect(markdown)
    .toContain(
      "## Summary",
    );


  expect(markdown)
    .toContain(
      "- Broken links: 0",
    );


  expect(markdown)
    .toContain(
      "## Broken links",
    );


  expect(markdown)
    .toContain(
      "No broken links found.",
    );


  expect(markdown)
    .toContain(
      "## Engineering Quality",
    );


  expect(markdown)
    .toContain(
      "No engineering issues found.",
    );

});
it("renders engineering quality issues", () => {

  const markdown =
    renderHealthReport({

      brokenLinks: [],

      orphanEntities: [],

      entitiesWithoutIncomingLinks: [],

      entitiesWithoutOutgoingLinks: [],

      duplicateRelationships: [],

      engineeringIssues: [
        {
          entity: {
            id: "REQ-001",
            type: "requirement",
            title: "Operating voltage",
          } as any,

          type:
            "missing-implementation",

          severity:
            "high",

          message:
            "Requirement has no implementing component.",
        },
      ],

    });


  expect(markdown)
    .toContain(
      "Engineering Quality",
    );


  expect(markdown)
    .toContain(
      "missing-implementation",
    );


  expect(markdown)
    .toContain(
      "Requirement has no implementing component.",
    );

});
  it("renders health report findings", () => {
    const entity = {
      id: "REQ-001",
      type: "requirement" as const,
      title: "Emergency stop",
      status: "draft" as const,
      tags: [],
      sourcePath: "Requirements/REQ-001.md",
      links: [],
      createdTime: 1,
      modifiedTime: 1,
      metadata: {},
      domain: "safety" as const,
      priority: "critical" as const,
      acceptanceCriteria: [],
    };

    const markdown = renderHealthReport({
      brokenLinks: [
        {
          entityId: "REQ-001",
          brokenLinkId: "CMP-404",
        },
      ],
      orphanEntities: [entity],
      entitiesWithoutIncomingLinks: [entity],
      entitiesWithoutOutgoingLinks: [entity],
      duplicateRelationships: [
        {
          sourceId: "REQ-001",
          targetId: "CMP-001",
        },
      ],
    });

    expect(markdown).toContain("- `REQ-001` links to missing entity `CMP-404`");
    expect(markdown).toContain("- `REQ-001` — Emergency stop");
    expect(markdown).toContain("- `REQ-001` links multiple times to `CMP-001`");
  });
});
