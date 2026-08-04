import type { EngineeringEntity } from "./EngineeringEntity";
import type { Relationship } from "./Relationship";


export interface EngineeringContext {

  readonly root:
    EngineeringEntity | undefined;


  readonly related:
    readonly EngineeringContextRelation[];

}


export interface EngineeringContextRelation {

  readonly entity:
    EngineeringEntity;


  readonly relationship:
    Relationship;

}
