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

  it("renders the health score", () => {
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
        healthScore: 87,
      },
    );

    expect(markdown).toContain("87");
  });

  it("renders the requirement count", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 15,
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

    expect(markdown).toContain("Requirements: 15");
  });

  it("renders the component count", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 0,
        componentCount: 8,
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

    expect(markdown).toContain("Components: 8");
  });

  it("renders the verification count", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 0,
        componentCount: 0,
        verificationCount: 11,
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

    expect(markdown).toContain("Verifications: 11");
  });

  it("renders the risk count", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 0,
        componentCount: 0,
        verificationCount: 0,
        riskCount: 4,
        adrCount: 0,
        brokenLinks: 0,
        orphanRequirements: 0,
        duplicateRelationships: 0,
      },
      {
        healthScore: 100,
      },
    );

    expect(markdown).toContain("Risks: 4");
  });

  it("renders the ADR count", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 0,
        componentCount: 0,
        verificationCount: 0,
        riskCount: 0,
        adrCount: 6,
        brokenLinks: 0,
        orphanRequirements: 0,
        duplicateRelationships: 0,
      },
      {
        healthScore: 100,
      },
    );

    expect(markdown).toContain("ADRs: 6");
  });

  it("renders the engineering overview heading", () => {
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

    expect(markdown).toContain("## Engineering Overview");
  });

  it("renders the health details heading", () => {
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

    expect(markdown).toContain("## Health Details");
  });

  it("renders the broken link count", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 0,
        componentCount: 0,
        verificationCount: 0,
        riskCount: 0,
        adrCount: 0,
        brokenLinks: 2,
        orphanRequirements: 0,
        duplicateRelationships: 0,
      },
      {
        healthScore: 100,
      },
    );

    expect(markdown).toContain("Broken links: 2");
  });

  it("renders the orphan requirement count", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 0,
        componentCount: 0,
        verificationCount: 0,
        riskCount: 0,
        adrCount: 0,
        brokenLinks: 0,
        orphanRequirements: 3,
        duplicateRelationships: 0,
      },
      {
        healthScore: 100,
      },
    );

    expect(markdown).toContain("Orphan requirements: 3");
  });

  it("renders the duplicate relationship count", () => {
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
        duplicateRelationships: 2,
      },
      {
        healthScore: 100,
      },
    );

    expect(markdown).toContain("Duplicate relationships: 2");
  });

  it("renders the complete dashboard markdown", () => {
    const renderer = new DashboardRenderer();

    const markdown = renderer.render(
      {
        requirementCount: 15,
        componentCount: 8,
        verificationCount: 11,
        riskCount: 4,
        adrCount: 6,
        brokenLinks: 2,
        orphanRequirements: 3,
        duplicateRelationships: 1,
      },
      {
        healthScore: 87,
      },
    );

    expect(markdown).toBe(
      [
        "# Engineering Dashboard",
        "",
        "Health score: 87",
        "",
        "## Engineering Overview",
        "",
        "Requirements: 15",
        "Components: 8",
        "Verifications: 11",
        "Risks: 4",
        "ADRs: 6",
        "",
        "## Health Details",
        "",
        "Broken links: 2",
        "Orphan requirements: 3",
        "Duplicate relationships: 1",
      ].join("\n"),
    );
  });
});
