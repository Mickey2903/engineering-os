export interface DashboardSnapshot {
  requirementCount: number;
  componentCount: number;
  verificationCount: number;
  riskCount: number;
  adrCount: number;

  brokenLinks: number;
  orphanRequirements: number;
  duplicateRelationships: number;
}
