import type { EngineeringDatabaseReader } from "../../database/EngineeringDatabaseReader";
import type { Risk } from "../../models/Risk";

import type { EngineeringRule } from "../EngineeringRule";
import type { EngineeringInsight } from "../EngineeringInsight";


export class RiskHealthRule implements EngineeringRule {
  public readonly id =
    "risk-health";

  public readonly name =
    "Risk health analysis";


  public evaluate(
    database: EngineeringDatabaseReader,
  ): readonly EngineeringInsight[] {

    const insights: EngineeringInsight[] = [];

    const risks =
      database.findByType(
        "risk",
      ) as readonly Risk[];


    for (const risk of risks) {

      if (
        risk.level === "unknown"
      ) {
        insights.push({
          id:
            `${risk.id}-unknown-level`,

          severity:
            "warning",

          title:
            "Unknown risk level",

          description:
            `Risk ${risk.id} has no defined risk level.`,

          objectId:
            risk.id,

          recommendation:
            "Define the risk classification.",
        });
      }


      if (
        (risk.level === "critical" ||
         risk.level === "high") &&
        !risk.mitigation
      ) {
        insights.push({
          id:
            `${risk.id}-missing-mitigation`,

          severity:
            "critical",

          title:
            "High risk without mitigation",

          description:
            `Risk ${risk.id} has a high impact level but no mitigation plan.`,

          objectId:
            risk.id,

          recommendation:
            "Create a mitigation plan for this risk.",
        });
      }


      if (
        risk.riskState === "open" &&
        !risk.owner
      ) {
        insights.push({
          id:
            `${risk.id}-missing-owner`,

          severity:
            "warning",

          title:
            "Open risk without owner",

          description:
            `Risk ${risk.id} is open but has no assigned owner.`,

          objectId:
            risk.id,

          recommendation:
            "Assign an owner responsible for risk handling.",
        });
      }

    }

    return insights;
  }
}
