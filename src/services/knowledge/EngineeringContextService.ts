import type { EngineeringKnowledgeGraphSnapshot } from "../../models/EngineeringKnowledgeGraphSnapshot";
import type { EngineeringContext } from "../../models/EngineeringContext";
import type { RelationshipType } from "../../models/Relationship";
import { RelationshipService } from "../RelationshipService";
import type { EngineeringDatabase } from "../../database/EngineeringDatabase";


export class EngineeringContextService {

  public constructor(
    private readonly snapshot:
      EngineeringKnowledgeGraphSnapshot,

    private readonly database:
      EngineeringDatabase,
  ) {}


  public generateContext(
    id: string,
  ): EngineeringContext {

   const objects =
    this.database.all();
    
    const graph =
  new RelationshipService(
    this.database,
  ).buildGraph();
    
    const root =
  objects.find(
    (object) => object.id === id,
  );


    const relatedIds =
      new Set<string>();


    for (const relationship of graph.outgoing(id)) {
      relatedIds.add(
        relationship.targetId,
      );
    }


    for (const relationship of graph.incoming(id)) {
      relatedIds.add(
        relationship.sourceId,
      );
    }


    const related =
  objects.filter(
        (object) =>
          relatedIds.has(object.id),
      );


    const relatedContexts =
  related.map(
    (entity) => ({
      entity,

      relationship: {
        sourceId:
          root?.id ?? "",

        targetId:
          entity.id,

        type:
  "link" as RelationshipType,
      },
    }),
  );


return {
  root,

  related:
    relatedContexts,
};
  }

}
