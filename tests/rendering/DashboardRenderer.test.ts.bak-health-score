import { describe, expect, it } from "vitest";

import { DashboardRenderer } from "../../src/rendering/DashboardRenderer";

describe("DashboardRenderer", () => {
  it("renders the dashboard heading", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 0,
        componentCount: 0,
        verificationCount: 0,
        riskCount: 0,
        adrCount: 0,
        brokenLinks: 0,
        orphanRequirements: 0,
        duplicateRelationships: 0,
      },
      {
        healthScore: 100,
      },
    );

    expect(markdown).toContain("# Engineering Dashboard");
  });
});
