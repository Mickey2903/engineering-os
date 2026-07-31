import type { EngineeringDatabaseReader } from "../../database/EngineeringDatabaseReader";
import type { Requirement } from "../../models/Requirement";
import type { Verification } from "../../models/Verification";

import type { EngineeringRule } from "../EngineeringRule";
import type { EngineeringInsight } from "../EngineeringInsight";

export class VerificationCoverageRule implements EngineeringRule {
  public readonly id =
    "verification-coverage";

  public readonly name =
    "Verification coverage analysis";


  public evaluate(
    database: EngineeringDatabaseReader,
  ): readonly EngineeringInsight[] {

    const insights: EngineeringInsight[] = [];

    const requirements =
      database.findByType(
        "requirement",
      ) as readonly Requirement[];

    const verifications =
      database.findByType(
        "verification",
      ) as readonly Verification[];


    const verifiedRequirementIds =
  new Set(
    verifications.flatMap(
      (verification) =>
        verification.requirementIds,
    ),
  );
    for (const requirement of requirements) {

      if (
        !verifiedRequirementIds.has(
          requirement.id,
        )
      ) {
        insights.push({
          id:
            `${requirement.id}-missing-verification-coverage`,

          severity:
            "warning",

          title:
            "Missing verification coverage",

          description:
            `Requirement ${requirement.id} has no verification activity.`,

          objectId:
            requirement.id,

          recommendation:
            "Create a verification linked to this requirement.",
        });
      }
    }

    return insights;
  }
}
