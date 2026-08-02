import type { EngineeringDatabase } from "../../database/EngineeringDatabase";
import { RelationshipService } from "../RelationshipService";
import type { EngineeringKnowledgeGraphSnapshot } from "../../models/EngineeringKnowledgeGraphSnapshot";


export class EngineeringKnowledgeGraphService {

  private readonly relationshipService:
    RelationshipService;


  public constructor(
    private readonly database: EngineeringDatabase,
  ) {

    this.relationshipService =
      new RelationshipService(
        database,
      );

  }


  public createSnapshot():
    EngineeringKnowledgeGraphSnapshot {

    const objects =
      this.database.all();


    const graph =
      this.relationshipService
        .buildGraph();


    return {

      objects,

      relationships:
        graph.all(),

      graph,

    };

  }

}
