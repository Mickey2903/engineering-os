import { describe, expect, it } from "vitest";

import { RequirementQualityRenderer } from "../../src/rendering/RequirementQualityRenderer";

describe("RequirementQualityRenderer", () => {
  it("renders the report heading", () => {
    const renderer = new RequirementQualityRenderer();

    const markdown = renderer.render({
      requirementCount: 1,
      averageScore: 80,
      entries: [],
    });

    expect(markdown).toContain("# Requirement Quality Report");
  });

  it("renders requirement quality issues", () => {
    const renderer = new RequirementQualityRenderer();

    const markdown = renderer.render({
      requirementCount: 1,
      averageScore: 60,
      entries: [
        {
          requirementId: "REQ-001",
          title: "Emergency stop",
          score: 60,
          issues: [
            {
              requirementId: "REQ-001",
              title: "Emergency stop",
              type: "missing-verification-method",
              message: "Missing verification method.",
            },
          ],
        },
      ],
    });

    expect(markdown).toContain("REQ-001 – Emergency stop");
    expect(markdown).toContain("Score: **60%**");
    expect(markdown).toContain("- Missing verification method.");
  });
});
