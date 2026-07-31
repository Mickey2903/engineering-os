export interface ImpactAnalysisReport {
  readonly rootObjectId: string;

  readonly affectedObjects: readonly string[];

  readonly affectedComponents: readonly string[];

  readonly affectedRequirements: readonly string[];

  readonly affectedTests: readonly string[];
}
