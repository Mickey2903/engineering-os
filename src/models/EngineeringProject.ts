export type EngineeringProjectStatus =
  | "concept"
  | "development"
  | "testing"
  | "production"
  | "archived";


export interface EngineeringProject {

  readonly id: string;

  readonly name: string;

  readonly description: string;

  readonly type: string;

  readonly status: EngineeringProjectStatus;

  readonly createdAt: string;

  readonly updatedAt: string;

}
