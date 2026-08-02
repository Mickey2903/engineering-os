import type { EngineeringEntity } from "./EngineeringEntity";
import type { Relationship } from "./Relationship";
import type { RelationshipGraph } from "../services/relationships/RelationshipGraph";


export interface EngineeringKnowledgeGraphSnapshot {

  readonly objects:
    readonly EngineeringEntity[];

  readonly relationships:
    readonly Relationship[];

  readonly graph:
    RelationshipGraph;
}

