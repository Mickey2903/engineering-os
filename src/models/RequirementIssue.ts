export type RequirementIssueType =
  | "missing-description"
  | "missing-rationale"
  | "missing-acceptance-criteria"
  | "missing-verification-method"
  | "missing-component-link"
  | "invalid-status";

export interface RequirementIssue {
  readonly requirementId: string;
  readonly title: string;
  readonly type: RequirementIssueType;
  readonly message: string;
}
