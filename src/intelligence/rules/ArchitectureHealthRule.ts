import type { EngineeringDatabaseReader } from "../../database/EngineeringDatabaseReader";
import type { Component } from "../../models/Component";
import type { EngineeringObject } from "../../models/EngineeringObject";

import type { EngineeringRule } from "../EngineeringRule";
import type { EngineeringInsight } from "../EngineeringInsight";


export class ArchitectureHealthRule implements EngineeringRule {
  public readonly id =
    "architecture-health";

  public readonly name =
    "Architecture health analysis";


  public evaluate(
    database: EngineeringDatabaseReader,
  ): readonly EngineeringInsight[] {

    const insights: EngineeringInsight[] = [];


    const architectures =
      database.findByType(
        "architecture",
      ) as readonly EngineeringObject[];


    const interfaces =
      database.findByType(
        "interface",
      ) as readonly EngineeringObject[];


    const components =
      database.findByType(
        "component",
      ) as readonly Component[];


    for (const architecture of architectures) {

      if (architecture.links.length === 0) {
        insights.push({
          id:
            `${architecture.id}-no-links`,

          severity:
            "warning",

          title:
            "Architecture has no relations",

          description:
            `Architecture ${architecture.id} has no linked engineering objects.`,

          objectId:
            architecture.id,

          recommendation:
            "Link architecture elements to components or interfaces.",
        });
      }
    }


    for (const item of interfaces) {

      if (item.links.length === 0) {
        insights.push({
          id:
            `${item.id}-no-links`,

          severity:
            "warning",

          title:
            "Interface has no relations",

          description:
            `Interface ${item.id} has no connected engineering objects.`,

          objectId:
            item.id,

          recommendation:
            "Connect the interface to related components.",
        });
      }
    }


    for (const component of components) {

      if (component.links.length === 0) {
        insights.push({
          id:
            `${component.id}-architecture-link`,

          severity:
            "info",

          title:
            "Component has no architecture relation",

          description:
            `Component ${component.id} is not linked to architecture elements.`,

          objectId:
            component.id,

          recommendation:
            "Assign the component to an architecture structure.",
        });
      }
    }


    return insights;
  }
}
