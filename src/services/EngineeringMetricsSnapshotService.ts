import type { EngineeringIntelligenceService } from "./EngineeringIntelligenceService";
import type { EngineeringMetricSnapshot } from "../models/EngineeringMetricSnapshot";

export class EngineeringMetricsSnapshotService {
  public constructor(
    private readonly intelligenceService: EngineeringIntelligenceService,
  ) {}

  public createSnapshot(date: string): EngineeringMetricSnapshot {
    const report = this.intelligenceService.analyze();

    return {
      date,
      overallScore: report.overallScore,
      healthScore: report.healthScore,
      requirementQualityScore: report.requirementQualityScore,
      verificationCoverageScore: report.verificationCoverageScore,
      traceabilityScore: report.traceabilityScore,
    };
  }
}
