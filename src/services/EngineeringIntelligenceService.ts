import type { EngineeringImprovementArea } from "../models/EngineeringIntelligenceReport";
import type { DashboardService } from "./DashboardService";
import type { DashboardStatisticsService } from "./DashboardStatisticsService";
import type { RequirementQualityService } from "./RequirementQualityService";
import type { VerificationCoverageService } from "./VerificationCoverageService";
import type { TraceabilityService } from "./TraceabilityService";

import type { EngineeringIntelligenceReport } from "../models/EngineeringIntelligenceReport";

export class EngineeringIntelligenceService {
  public constructor(
    private readonly dashboardService: DashboardService,
    private readonly dashboardStatisticsService: DashboardStatisticsService,
    private readonly requirementQualityService: RequirementQualityService,
    private readonly verificationCoverageService: VerificationCoverageService,
    private readonly traceabilityService: TraceabilityService,
  ) {}

  public analyze(): EngineeringIntelligenceReport {
    const dashboardSnapshot = this.dashboardService.createSnapshot();

    const healthScore =
      this.dashboardStatisticsService.calculate(dashboardSnapshot).healthScore;

    const requirementQuality =
      this.requirementQualityService.analyze();

    const verificationCoverage =
      this.verificationCoverageService.analyze();

    const traceability =
      this.traceabilityService.createSnapshot();

    const requirementQualityScore =
      requirementQuality.averageScore;

    const verificationCoverageScore =
      verificationCoverage.coveragePercentage;

    const traceabilityScore =
      traceability.requirementCount === 0
        ? 0
        : Math.round(
            (traceability.tracedRequirementCount /
              traceability.requirementCount) *
              100,
          );

    const overallScore =
      dashboardSnapshot.requirementCount === 0
        ? 0
        : Math.round(
            (healthScore +
              requirementQualityScore +
              verificationCoverageScore +
              traceabilityScore) /
              4,
          );
    return {
      overallScore,
      healthScore,
      requirementQualityScore,
      verificationCoverageScore,
      traceabilityScore,
      improvementAreas: this.createImprovementAreas(
        healthScore,
        requirementQualityScore,
        verificationCoverageScore,
        traceabilityScore,
      ),
    };
  }

  private createImprovementAreas(
    healthScore: number,
    requirementQualityScore: number,
    verificationCoverageScore: number,
    traceabilityScore: number,
  ): readonly EngineeringImprovementArea[] {
    const areas: EngineeringImprovementArea[] = [];

    if (healthScore < 90) {
      areas.push({
        category: "health",
        message: "Engineering health issues detected.",
        severity: "high",
      });
    }

    if (requirementQualityScore < 70) {
      areas.push({
        category: "requirement-quality",
        message: "Requirement quality is below target.",
        severity: "medium",
      });
    }

    if (verificationCoverageScore < 80) {
      areas.push({
        category: "verification",
        message: "Verification coverage needs improvement.",
        severity: "high",
      });
    }

    if (traceabilityScore < 90) {
      areas.push({
        category: "traceability",
        message: "Traceability coverage is incomplete.",
        severity: "medium",
      });
    }

    return areas;
  }
}
