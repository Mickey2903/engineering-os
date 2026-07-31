import type { DashboardSnapshot } from "../models/DashboardSnapshot";
import type { DashboardStatistics } from "../models/DashboardStatistics";

export class DashboardRenderer {
  public render(snapshot: DashboardSnapshot, statistics: DashboardStatistics): string {
    void snapshot;

    return [
      "# Engineering Dashboard",
      "",
      "Health score: " + String(statistics.healthScore),
      "",
      "## Engineering Overview",
      "",
      "Requirements: " + String(snapshot.requirementCount),
      "Components: " + String(snapshot.componentCount),
      "Verifications: " + String(snapshot.verificationCount),
      "Risks: " + String(snapshot.riskCount),
      "ADRs: " + String(snapshot.adrCount),
      "",
      "## Health Details",
      "",
      "Broken links: " + String(snapshot.brokenLinks),
    ].join("\n");
  }
}
