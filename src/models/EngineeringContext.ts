import type { EngineeringEntity } from "./EngineeringEntity";


export interface EngineeringContext {

  readonly root:
    EngineeringEntity | undefined;

  readonly related:
    readonly EngineeringEntity[];

}
