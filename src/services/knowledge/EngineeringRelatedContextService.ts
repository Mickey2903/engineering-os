import type { EngineeringKnowledgeGraphSnapshot } from "../../models/EngineeringKnowledgeGraphSnapshot";


export class EngineeringRelatedContextService {

  public constructor(
    private readonly snapshot:
      EngineeringKnowledgeGraphSnapshot,
  ) {}


  public findRelated(
    objectId: string,
  ) {

    const relatedIds =
      new Set<string>();


    for (
      const relationship of
      this.snapshot.graph.outgoing(objectId)
    ) {

      relatedIds.add(
        relationship.targetId,
      );

    }


    for (
      const relationship of
      this.snapshot.graph.incoming(objectId)
    ) {

      relatedIds.add(
        relationship.sourceId,
      );

    }


    return this.snapshot.objects.filter(
      (object) =>
        relatedIds.has(
          object.id,
        ),
    );

  }

}
