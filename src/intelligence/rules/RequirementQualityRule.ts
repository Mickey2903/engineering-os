import type { EngineeringDatabaseReader } from "../../database/EngineeringDatabaseReader";
import type { Requirement } from "../../models/Requirement";

import type { EngineeringRule } from "../EngineeringRule";
import type { EngineeringInsight } from "../EngineeringInsight";

export class RequirementQualityRule implements EngineeringRule {
  public readonly id = "requirement-quality";

  public readonly name = "Requirement quality analysis";

  public evaluate(
    database: EngineeringDatabaseReader,
  ): readonly EngineeringInsight[] {
    const insights: EngineeringInsight[] = [];

    const requirements =
      database.findByType("requirement") as readonly Requirement[];

    for (const requirement of requirements) {
      if (!requirement.verificationMethod) {
        insights.push({
          id: `${requirement.id}-missing-verification`,
          severity: "warning",
          title: "Missing verification method",
          description:
            `Requirement ${requirement.id} has no verification method.`,
          objectId: requirement.id,
          recommendation:
            "Add analysis, inspection, demonstration or test verification.",
        });
      }

      if (requirement.acceptanceCriteria.length === 0) {
        insights.push({
          id: `${requirement.id}-missing-criteria`,
          severity: "warning",
          title: "Missing acceptance criteria",
          description:
            `Requirement ${requirement.id} has no acceptance criteria.`,
          objectId: requirement.id,
          recommendation:
            "Define measurable acceptance criteria.",
        });
      }
    }

    return insights;
  }
}
