import type { DashboardService } from "./DashboardService";
import type { DashboardStatisticsService } from "./DashboardStatisticsService";
import type { TraceabilityService } from "./TraceabilityService";
import type { HealthService } from "./HealthService";

import type { DashboardRenderer } from "../rendering/DashboardRenderer";
import type { TraceabilityRenderer } from "../rendering/TraceabilityRenderer";

import { renderHealthReport } from "../rendering/HealthReportRenderer";

export interface EngineeringReport {
  readonly dashboard: string;
  readonly traceability: string;
  readonly health: string;
}

export class EngineeringReportService {
  public constructor(
    private readonly dashboardService: DashboardService,
    private readonly dashboardStatisticsService: DashboardStatisticsService,
    private readonly traceabilityService: TraceabilityService,
    private readonly healthService: HealthService,
    private readonly dashboardRenderer: DashboardRenderer,
    private readonly traceabilityRenderer: TraceabilityRenderer,
  ) {}

  public generate(): EngineeringReport {
    const dashboardSnapshot = this.dashboardService.createSnapshot();
    const dashboardStatistics = this.dashboardStatisticsService.calculate(dashboardSnapshot);

    const traceabilitySnapshot = this.traceabilityService.createSnapshot();

    const healthReport = this.healthService.healthReport();

    return {
      dashboard: this.dashboardRenderer.render(dashboardSnapshot, dashboardStatistics),

      traceability: this.traceabilityRenderer.render(traceabilitySnapshot),

      health: renderHealthReport(healthReport),
    };
  }
}
