export type EngineeringReferenceType =
  | "requirement"
  | "component"
  | "verification"
  | "risk"
  | "adr"
  | "test";

export interface EngineeringObjectReference {
  readonly objectId: string;

  readonly objectType: EngineeringReferenceType;

  readonly sourcePath: string;

  readonly title: string;
}
