import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { EngineeringLink } from "../models/EngineeringLink";
import type { EngineeringRelationshipService } from "./EngineeringRelationshipService";

export class EngineeringRelationshipIndexer {
  public constructor(
    private readonly relationshipService: EngineeringRelationshipService,
  ) {}

  public indexObject(
  object: EngineeringEntity,
): void {

  console.log(
    "[Relationship index]",
    object.id,
    object.metadata,
  );

  this.relationshipService.removeLinksForObject(
    object.id,
  );
    this.relationshipService.removeLinksForObject(
      object.id,
    );

    const metadata = object.metadata ?? {};

    this.indexRelation(
      object,
      metadata.implements,
      "implements",
    );

    this.indexRelation(
      object,
      metadata.verifies,
      "verifies",
    );

    this.indexRelation(
      object,
      metadata.affects,
      "affects",
    );
  }

  private indexRelation(
  object: EngineeringEntity,
  targets: unknown,
  type: EngineeringLink["type"],
): void {
  console.log(
    "[Index relation]",
    object.id,
    type,
    targets,
  );

  if (!Array.isArray(targets)) {
    return;
  }

  for (const target of targets) {
    if (typeof target !== "string") {
      continue;
    }

    console.log(
      "[Adding relation]",
      object.id,
      type,
      target,
    );

    this.relationshipService.addLink({
      id: `${object.id}-${type}-${target}`,
      sourceId: object.id,
      targetId: target,
      type,
      createdAt: new Date().toISOString(),
    });
  }
}
}
