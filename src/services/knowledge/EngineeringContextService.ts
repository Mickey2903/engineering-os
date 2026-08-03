import type { EngineeringKnowledgeGraphSnapshot } from "../../models/EngineeringKnowledgeGraphSnapshot";
import type { EngineeringContext } from "../../models/EngineeringContext";


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

   const root =
  this.database.all()
    .find(
      (object) =>
        object.id === id,
    );


    const relatedIds =
      new Set<string>();


    for (const relationship of this.snapshot.graph.outgoing(id)) {
      relatedIds.add(
        relationship.targetId,
      );
    }


    for (const relationship of this.snapshot.graph.incoming(id)) {
      relatedIds.add(
        relationship.sourceId,
      );
    }


    const related =
  this.database.all().filter(
        (object) =>
          relatedIds.has(object.id),
      );


    return {
      root,
      related,
    };
  }

}
