import type { DashboardSnapshot } from "../models/DashboardSnapshot";
import type { DashboardStatistics } from "../models/DashboardStatistics";

export class DashboardRenderer {
  public render(snapshot: DashboardSnapshot, statistics: DashboardStatistics): string {
    return [
      "# Engineering Dashboard",
      "",
      "Health score: " + String(statistics.healthScore),
      "",
      ...this.renderEngineeringOverview(snapshot),
      "",
      ...this.renderHealthDetails(snapshot),
    ].join("\n");
  }

  private renderEngineeringOverview(snapshot: DashboardSnapshot): string[] {
    return [
      "## Engineering Overview",
      "",
      "Requirements: " + String(snapshot.requirementCount),
      "Components: " + String(snapshot.componentCount),
      "Verifications: " + String(snapshot.verificationCount),
      "Risks: " + String(snapshot.riskCount),
      "ADRs: " + String(snapshot.adrCount),
    ];
  }

  private renderHealthDetails(snapshot: DashboardSnapshot): string[] {
    return [
      "## Health Details",
      "",
      "Broken links: " + String(snapshot.brokenLinks),
      "Orphan requirements: " + String(snapshot.orphanRequirements),
      "Duplicate relationships: " + String(snapshot.duplicateRelationships),
    ];
  }
}
