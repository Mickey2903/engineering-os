import type {
  RelationshipType,
} from "../../models/Relationship";


const inverseRelationships:
Record<
  RelationshipType,
  RelationshipType | undefined
> = {

  link:
    undefined,

  implements:
    "implemented-by",

  "implemented-by":
    "implements",

  verifies:
    "verified-by",

  "verified-by":
    "verifies",

  uses:
    "used-by",

  "used-by":
    "uses",

  contains:
    "contained-by",

  "contained-by":
    "contains",

  supersedes:
    "superseded-by",

  "superseded-by":
    "supersedes",

  "documented-by":
    undefined,

  "derived-from":
    "derived-into",

  "derived-into":
    "derived-from",
};


export class RelationshipResolver {

  public static inverse(
    type: RelationshipType,
  ):
    RelationshipType | undefined {

    return inverseRelationships[type];

  }

}
