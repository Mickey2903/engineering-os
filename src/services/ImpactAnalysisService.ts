import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { EngineeringEntity } from "../models/EngineeringEntity";
import { RelationshipImpactResolver }
from "./relationships/RelationshipImpactResolver";
import { RelationshipService } from "./RelationshipService";
import { RelationshipQueryService } from "./relationships/RelationshipQueryService";
import type { Relationship } from "../models/Relationship";
import type {
  ImpactAnalysisResult,
  ImpactPath,
} from "../models/ImpactAnalysis";
export class ImpactAnalysisService {

  private readonly queryService:
    RelationshipQueryService;

private readonly database:
  EngineeringDatabase;
  public constructor(
  database: EngineeringDatabase,
) {

  this.database = database;

  const graph =
    new RelationshipService(
      database,
    )
    .buildGraph();


  this.queryService =
    new RelationshipQueryService(
      database,
      graph,
    );

}

public analyze(
  entityId: string,
): ImpactAnalysisResult | undefined {


  const entity =
    this.database.findById(
      entityId,
    );


  if (!entity) {
    return undefined;
  }


   const impacted: ImpactPath[] = [];


    const visited =
      new Set<string>();


const queue: {
  id: string;

  depth: number;

  path: readonly Relationship[];

}[] = [

  {
    id: entityId,

    depth: 0,

    path: [],

  },

];


    while(queue.length > 0) {

      const current =
        queue.shift();


      if (!current) {
        continue;
      }


      if (
        visited.has(current.id)
      ) {
        continue;
      }


      visited.add(
        current.id,
      );


      const relationships =
        this.queryService
          .findRelatedWithRelationships(
            current.id,
          );


    for (
  const related of relationships
) {

  if (
    related.entity.id === entityId
  ) {
    continue;
  }
  
impacted.push({

  entity:
    related.entity,

  path: [
    ...current.path,

    {
      sourceId:
        current.id,

      targetId:
        related.entity.id,

      type:
        related.relationship,

    },
  ],

  depth:
    current.depth + 1,
severity:
  RelationshipImpactResolver.resolve(
    related.relationship,
  ),
});

queue.push({

  id:
    related.entity.id,

  depth:
    current.depth + 1,

  path: [
    ...current.path,

    {
      sourceId:
        current.id,

      targetId:
        related.entity.id,

      type:
        related.relationship,

    },
  ],

});

}

    }


    return {

      root:
        entity,

      impacted,

    };

  }
public findImpactedEntities(
  entityId: string,
): readonly EngineeringEntity[] {

  const result =
    this.analyze(
      entityId,
    );


  if (!result) {
    return [];
  }


  return result.impacted.map(
    (item) =>
      item.entity,
  );

}
}
