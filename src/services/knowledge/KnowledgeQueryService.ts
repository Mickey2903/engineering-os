import type { EngineeringKnowledgeGraphSnapshot } from "../../models/EngineeringKnowledgeGraphSnapshot";


export class KnowledgeQueryService {

  public constructor(
    private readonly snapshot:
      EngineeringKnowledgeGraphSnapshot,
  ) {}


  public getRelatedObjectIds(
    id: string,
  ): readonly string[] {

    const related = new Set<string>();


    for (const relationship of this.snapshot.graph.outgoing(id)) {
      related.add(relationship.targetId);
    }


    for (const relationship of this.snapshot.graph.incoming(id)) {
      related.add(relationship.sourceId);
    }


    return [...related];
  }


  public getObject(
    id: string,
  ) {
    return this.snapshot.objects.find(
      (object) => object.id === id,
    );
  }


  public getObjectsByType(
    type: string,
  ) {

    return this.snapshot.objects.filter(
      (object) => object.type === type,
    );

  }

}
