import type { DashboardSnapshot } from "../models/DashboardSnapshot";

interface DashboardDataSource {
  getRequirements(): readonly unknown[];
  getComponents(): readonly unknown[];
  getVerifications(): readonly unknown[];
  getRisks(): readonly unknown[];
  getAdrs(): readonly unknown[];
}

interface DashboardHealthMetrics {
  getBrokenLinkCount(): number;
  getOrphanRequirementCount(): number;
  getDuplicateRelationshipCount(): number;
}

export class DashboardService {
  public constructor(
    private readonly dataSource: DashboardDataSource,
    private readonly healthMetrics?: DashboardHealthMetrics,
  ) {}

  public createSnapshot(): DashboardSnapshot {
    return {
      requirementCount: this.dataSource.getRequirements().length,
      componentCount: this.dataSource.getComponents().length,
      verificationCount: this.dataSource.getVerifications().length,
      riskCount: this.dataSource.getRisks().length,
      adrCount: this.dataSource.getAdrs().length,
      brokenLinks: this.healthMetrics?.getBrokenLinkCount() ?? 0,
      orphanRequirements: this.healthMetrics?.getOrphanRequirementCount() ?? 0,
      duplicateRelationships: this.healthMetrics?.getDuplicateRelationshipCount() ?? 0,
    };
  }
}
