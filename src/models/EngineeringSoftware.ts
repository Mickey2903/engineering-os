import type { EngineeringObject } from "./EngineeringObject";

export interface EngineeringSoftware extends EngineeringObject {
  readonly type: "software";

  readonly language?: string;

  readonly repositoryPath?: string;

  readonly projectId?: string;

  readonly version?: string;
}
