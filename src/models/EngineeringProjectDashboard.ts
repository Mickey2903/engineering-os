export interface EngineeringProjectDashboard {
  readonly projectId: string;

  readonly projectName: string;

  readonly requirementCount: number;

  readonly componentCount: number;

  readonly verificationCount: number;

  readonly riskCount: number;

  readonly adrCount: number;

  readonly requirementQualityScore: number;

  readonly verificationCoverageScore: number;

  readonly traceabilityScore: number;

  readonly healthScore: number;
}
