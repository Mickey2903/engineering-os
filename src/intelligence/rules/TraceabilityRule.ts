import type { EngineeringDatabaseReader } from "../../database/EngineeringDatabaseReader";
import type { EngineeringRule } from "../EngineeringRule";
import type { EngineeringInsight } from "../EngineeringInsight";
import type { Requirement } from "../../models/Requirement";

export class TraceabilityRule implements EngineeringRule {
  public readonly id =
    "traceability";

  public readonly name =
    "Requirement traceability analysis";


  public evaluate(
    database: EngineeringDatabaseReader,
  ): readonly EngineeringInsight[] {

    const insights: EngineeringInsight[] = [];

    const requirements =
      database.findByType(
        "requirement",
      ) as readonly Requirement[];


    for (const requirement of requirements) {

      if (requirement.links.length === 0) {

        insights.push({
          id:
            `${requirement.id}-missing-links`,

          severity:
            "warning",

          title:
            "Incomplete traceability",

          description:
            `Requirement ${requirement.id} has no linked engineering objects.`,

          objectId:
            requirement.id,

          recommendation:
            "Link the requirement to components, verifications or other engineering objects.",
        });
      }
    }

    return insights;
  }
}
