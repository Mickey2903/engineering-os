import type { EngineeringDatabase } from "../../database/EngineeringDatabase";
import type { RelationshipType } from "../../models/Relationship";
import type { EngineeringEntity } from "../../models/EngineeringEntity";
import { RelationshipGraph } from "./RelationshipGraph";
export interface RelatedEngineeringEntity {

  readonly entity:
    EngineeringEntity;

  readonly relationship:
    RelationshipType;

}
export class RelationshipQueryService {

  public constructor(
    private readonly database: EngineeringDatabase,
    private readonly graph: RelationshipGraph,
  ) {}


  public findRelated(
    objectId: string,
    relationshipType?: RelationshipType,
  ): EngineeringEntity[] {

    const relationships =
      this.graph.outgoing(objectId);


    return relationships
      .filter(
        (relationship) =>
          !relationshipType
          || relationship.type === relationshipType,
      )
      .map(
        (relationship) =>
         this.database.get(
            relationship.targetId,
          ),
      )
      .filter(
        (entity): entity is EngineeringEntity =>
          entity !== undefined,
      );

  }

public findRelatedWithRelationships(
  objectId: string,
  relationshipType?: RelationshipType,
): readonly RelatedEngineeringEntity[] {

  const relationships =
    this.graph.outgoing(objectId);


  return relationships
    .filter(
      (relationship) =>
        !relationshipType
        || relationship.type === relationshipType,
    )
    .map(
      (relationship) => {

        const entity =
          this.database.findById(
            relationship.targetId,
          );


        if (!entity) {
          return undefined;
        }


        return {

          entity,

          relationship:
            relationship.type,

        };

      },
    )
    .filter(
      (
        item,
      ): item is RelatedEngineeringEntity =>
        item !== undefined,
    );

}
  public findIncoming(
    objectId: string,
    relationshipType?: RelationshipType,
  ): EngineeringEntity[] {

    const relationships =
      this.graph.incoming(objectId);


    return relationships
      .filter(
        (relationship) =>
          !relationshipType
          || relationship.type === relationshipType,
      )
      .map(
        (relationship) =>
         this.database.get(
            relationship.sourceId,
          ),
      )
      .filter(
        (entity): entity is EngineeringEntity =>
          entity !== undefined,
      );

  }

}
