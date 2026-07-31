import type { EngineeringProjectDashboard } from "../models/EngineeringProjectDashboard";

export class EngineeringProjectDashboardRenderer {
  public render(
    dashboard: EngineeringProjectDashboard,
  ): string {
    return `# ${dashboard.projectName} Dashboard

## Overview

| Metric | Value |
|---|---:|
| Requirements | ${dashboard.requirementCount} |
| Components | ${dashboard.componentCount} |
| Verification | ${dashboard.verificationCount} |
| Risks | ${dashboard.riskCount} |
| ADRs | ${dashboard.adrCount} |

## Engineering Quality

| Metric | Score |
|---|---:|
| Requirement Quality | ${dashboard.requirementQualityScore}% |
| Verification Coverage | ${dashboard.verificationCoverageScore}% |
| Traceability | ${dashboard.traceabilityScore}% |
| Health | ${dashboard.healthScore}% |
`;
  }
}
