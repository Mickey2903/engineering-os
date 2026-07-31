import type { DashboardService } from "./DashboardService";
import type { DashboardStatisticsService } from "./DashboardStatisticsService";
import type { TraceabilityService } from "./TraceabilityService";
import type { HealthService } from "./HealthService";
import type { RequirementQualityService } from "./RequirementQualityService";
import type { VerificationCoverageService } from "./VerificationCoverageService";
import type { EngineeringIntelligenceService } from "./EngineeringIntelligenceService";

import type { DashboardRenderer } from "../rendering/DashboardRenderer";
import type { TraceabilityRenderer } from "../rendering/TraceabilityRenderer";
import type { RequirementQualityRenderer } from "../rendering/RequirementQualityRenderer";
import type { VerificationCoverageRenderer } from "../rendering/VerificationCoverageRenderer";
import type { EngineeringIntelligenceRenderer } from "../rendering/EngineeringIntelligenceRenderer";

import { renderHealthReport } from "../rendering/HealthReportRenderer";

export interface EngineeringReport {
  readonly dashboard: string;
  readonly traceability: string;
  readonly health: string;
  readonly requirementQuality: string;
  readonly verificationCoverage: string;
  readonly intelligence: string;
}

export class EngineeringReportService {
  public constructor(
    private readonly dashboardService: DashboardService,
    private readonly dashboardStatisticsService: DashboardStatisticsService,
    private readonly traceabilityService: TraceabilityService,
    private readonly healthService: HealthService,
    private readonly requirementQualityService: RequirementQualityService,
    private readonly verificationCoverageService: VerificationCoverageService,
    private readonly intelligenceService: EngineeringIntelligenceService,
    private readonly dashboardRenderer: DashboardRenderer,
    private readonly traceabilityRenderer: TraceabilityRenderer,
    private readonly requirementQualityRenderer: RequirementQualityRenderer,
    private readonly verificationCoverageRenderer: VerificationCoverageRenderer,
    private readonly intelligenceRenderer: EngineeringIntelligenceRenderer,
  ) {}

  public generate(): EngineeringReport {
    const dashboardSnapshot = this.dashboardService.createSnapshot();
    const dashboardStatistics =
      this.dashboardStatisticsService.calculate(dashboardSnapshot);

    const traceabilitySnapshot = this.traceabilityService.createSnapshot();

    const healthReport = this.healthService.healthReport();

    const requirementQualityReport =
      this.requirementQualityService.analyze();

    const verificationCoverageReport =
      this.verificationCoverageService.analyze();

    const intelligenceReport =
      this.intelligenceService.analyze();

    return {
      dashboard: this.dashboardRenderer.render(
        dashboardSnapshot,
        dashboardStatistics,
      ),

      traceability: this.traceabilityRenderer.render(traceabilitySnapshot),

      health: renderHealthReport(healthReport),

      requirementQuality:
        this.requirementQualityRenderer.render(requirementQualityReport),

      verificationCoverage:
        this.verificationCoverageRenderer.render(verificationCoverageReport),

      intelligence:
        this.intelligenceRenderer.render(intelligenceReport),
    };
  }
}
