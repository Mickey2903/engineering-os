import type { RequirementIssue } from "./RequirementIssue";

export interface RequirementQualityEntry {
  readonly requirementId: string;
  readonly title: string;
  readonly score: number;
  readonly issues: readonly RequirementIssue[];
}

export interface RequirementQualityReport {
  readonly requirementCount: number;
  readonly averageScore: number;
  readonly entries: readonly RequirementQualityEntry[];
}
