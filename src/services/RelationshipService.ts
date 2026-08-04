import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import { RelationshipResolver } from "./relationships/RelationshipResolver";

import {
  relationshipTypes,
  type RelationshipType,
  type Relationship,
} from "../models/Relationship";

import { RelationshipGraph } from "./relationships/RelationshipGraph";

import {
  isVerification,
} from "../models/EngineeringEntity";


function isRelationshipType(
  value: string,
): value is RelationshipType {

  return relationshipTypes.includes(
    value as RelationshipType,
  );

}
export class RelationshipService {
  public constructor(private readonly database: EngineeringDatabase) {}

public buildGraph(): RelationshipGraph {

  const entities =
    this.database.all();


  const relationships: Relationship[] = [];


  for (const entity of entities) {

    // Normale links
    for (const targetId of entity.links) {

      relationships.push({
        sourceId: entity.id,
        targetId,
        type: "link",
      });
      

    }


    // YAML relaties
    const metadata =
      entity.metadata as Record<string, unknown>;


    if (metadata) {
for (const [relationType, value] of Object.entries(metadata)) {


  if (!isRelationshipType(relationType)) {
    continue;
  }


  if (!Array.isArray(value)) {
    continue;
  }


  for (const targetId of value) {


    if (typeof targetId !== "string") {
      continue;
    }


    relationships.push({
      sourceId: entity.id,
      targetId,
      type: relationType,
    });
const inverse =
  RelationshipResolver.inverse(
    relationType,
  );


if (inverse) {

  relationships.push({
    sourceId: targetId,
    targetId: entity.id,
    type: inverse,
  });

}

  }

}


    }

// Verification relaties
if (isVerification(entity)) {

  for (const requirementId of entity.requirementIds) {

    relationships.push({
      sourceId: entity.id,
      targetId: requirementId,
      type: "verifies",
    });


    relationships.push({
      sourceId: requirementId,
      targetId: entity.id,
      type: "verified-by",
    });

  }

}
  }

  return new RelationshipGraph(
    relationships,
  );
}
}
