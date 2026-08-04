import type { RelationshipType } from "../../models/Relationship";
import type { ImpactSeverity } from "../../models/ImpactSeverity";


const impactMap:
Record<RelationshipType, ImpactSeverity> = {

  implements:
    "critical",

  "implemented-by":
    "critical",

  verifies:
    "critical",

  "verified-by":
    "critical",

  uses:
    "high",

  "used-by":
    "high",

  contains:
    "medium",

  "contained-by":
    "medium",

  "supersedes":
    "high",

  "superseded-by":
    "high",

  "documented-by":
    "low",

  "derived-from":
    "medium",

  "derived-into":
    "medium",

  link:
    "low",

};


export class RelationshipImpactResolver {


  public static resolve(
    relationship:
      RelationshipType,
  ): ImpactSeverity {

    return impactMap[
      relationship
    ];

  }

}
