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
      "Requirements: " + String(snapshot.requirementCount),
      "Components: " + String(snapshot.componentCount),
    ].join("\n");
  }
}
