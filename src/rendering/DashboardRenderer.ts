import type { DashboardSnapshot } from "../models/DashboardSnapshot";
import type { DashboardStatistics } from "../models/DashboardStatistics";
import { MarkdownReportBuilder } from "./MarkdownReportBuilder";

export class DashboardRenderer {
  public render(snapshot: DashboardSnapshot, statistics: DashboardStatistics): string {
    const builder = new MarkdownReportBuilder();

    builder.heading("Engineering Dashboard");
    builder.blank();
    builder.line(`Health score: ${String(statistics.healthScore)}`);
    builder.blank();

    this.renderEngineeringOverview(builder, snapshot);
    builder.blank();
    this.renderHealthDetails(builder, snapshot);

    return builder.build();
  }

  private renderEngineeringOverview(
    builder: MarkdownReportBuilder,
    snapshot: DashboardSnapshot,
  ): void {
    builder.section("Engineering Overview");
    builder.blank();
    builder.line(`Requirements: ${String(snapshot.requirementCount)}`);
    builder.line(`Components: ${String(snapshot.componentCount)}`);
    builder.line(`Verifications: ${String(snapshot.verificationCount)}`);
    builder.line(`Risks: ${String(snapshot.riskCount)}`);
    builder.line(`ADRs: ${String(snapshot.adrCount)}`);
  }

  private renderHealthDetails(builder: MarkdownReportBuilder, snapshot: DashboardSnapshot): void {
    builder.section("Health Details");
    builder.blank();
    builder.line(`Broken links: ${String(snapshot.brokenLinks)}`);
    builder.line(`Orphan requirements: ${String(snapshot.orphanRequirements)}`);
    builder.line(`Duplicate relationships: ${String(snapshot.duplicateRelationships)}`);
  }
}
