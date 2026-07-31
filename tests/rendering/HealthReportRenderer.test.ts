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

    expect(markdown).toBe(
      [
        "# Engineering Health Report",
        "",
        "## Summary",
        "",
        "- Broken links: 0",
        "- Orphan entities: 0",
        "- Entities without incoming links: 0",
        "- Entities without outgoing links: 0",
        "- Duplicate relationships: 0",
        "",
        "---",
        "",
        "## Broken links",
        "",
        "No broken links found.",
        "",
        "## Orphan entities",
        "",
        "No orphan entities found.",
        "",
        "## Entities without incoming links",
        "",
        "Every entity has at least one incoming link.",
        "",
        "## Entities without outgoing links",
        "",
        "Every entity has at least one outgoing link.",
        "",
        "## Duplicate relationships",
        "",
        "No duplicate relationships found.",
        "",
      ].join("\n"),
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
