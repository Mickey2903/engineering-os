import type { EngineeringDatabaseReader } from "../../database/EngineeringDatabaseReader";
import type { Component } from "../../models/Component";

import type { EngineeringRule } from "../EngineeringRule";
import type { EngineeringInsight } from "../EngineeringInsight";


export class ComponentHealthRule implements EngineeringRule {
  public readonly id =
    "component-health";

  public readonly name =
    "Component health analysis";


  public evaluate(
    database: EngineeringDatabaseReader,
  ): readonly EngineeringInsight[] {

    const insights: EngineeringInsight[] = [];

    const components =
      database.findByType(
        "component",
      ) as readonly Component[];


    for (const component of components) {

      if (component.lifecycle === "unknown") {
        insights.push({
          id:
            `${component.id}-missing-lifecycle`,

          severity:
            "warning",

          title:
            "Missing component lifecycle",

          description:
            `Component ${component.id} has no lifecycle information.`,

          objectId:
            component.id,

          recommendation:
            "Define the lifecycle state of the component.",
        });
      }


      if (component.lifecycle === "obsolete") {
        insights.push({
          id:
            `${component.id}-obsolete`,

          severity:
            "critical",

          title:
            "Obsolete component",

          description:
            `Component ${component.id} is marked as obsolete.`,

          objectId:
            component.id,

          recommendation:
            "Review replacement or migration strategy.",
        });
      }


      if (component.links.length === 0) {
        insights.push({
          id:
            `${component.id}-no-links`,

          severity:
            "info",

          title:
            "Component has no relations",

          description:
            `Component ${component.id} has no linked engineering objects.`,

          objectId:
            component.id,

          recommendation:
            "Link the component to requirements, interfaces or verification.",
        });
      }
    }

    return insights;
  }
}
