import type { EngineeringEntity } from "./EngineeringEntity";
import type { Relationship } from "./Relationship";
import type { ImpactSeverity } from "./ImpactSeverity";

export interface ImpactPath {

  readonly entity:
    EngineeringEntity;

  readonly path:
    readonly Relationship[];

  readonly depth:
    number;

  readonly severity:
    ImpactSeverity;

}


export interface ImpactAnalysisResult {

  readonly root:
    EngineeringEntity;


  readonly impacted:
    readonly ImpactPath[];

}
