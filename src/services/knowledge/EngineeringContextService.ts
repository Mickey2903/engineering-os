import type { EngineeringKnowledgeGraphSnapshot } from "../../models/EngineeringKnowledgeGraphSnapshot";
import type { EngineeringContext } from "../../models/EngineeringContext";


export class EngineeringContextService {

  public constructor(
    private readonly snapshot:
      EngineeringKnowledgeGraphSnapshot,
  ) {}


  public generateContext(
    id: string,
  ): EngineeringContext {

    const root =
      this.snapshot.objects.find(
        (object) => object.id === id,
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
      this.snapshot.objects.filter(
        (object) =>
          relatedIds.has(object.id),
      );


    return {
      root,
      related,
    };
  }

}
