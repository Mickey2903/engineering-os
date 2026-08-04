import type { ImpactAnalysisResult, ImpactPath } from "../models/ImpactAnalysis";


export class ImpactReportRenderer {


  public render(
    analysis: ImpactAnalysisResult,
  ): string {


    const lines: string[] = [];


    lines.push(
      `# Impact Analysis: ${analysis.root.id}`,
      "",
      `Root object: ${analysis.root.title}`,
      "",
    );


    if (
      analysis.impacted.length === 0
    ) {

      lines.push(
        "No impacted objects found.",
      );

      return lines.join("\n");

    }


const grouped =
  new Map<string, ImpactPath[]>();


    for (
      const impact of analysis.impacted
    ) {

      const list =
        grouped.get(
          impact.severity,
        )
        ?? [];


      list.push(
        impact,
      );


      grouped.set(
        impact.severity,
        list,
      );

    }


    const order = [
      "critical",
      "high",
      "medium",
      "low",
    ];


    for (
      const severity of order
    ) {

      const impacts =
        grouped.get(
          severity,
        );


      if (
        !impacts
        ||
        impacts.length === 0
      ) {
        continue;
      }


      lines.push(
        "",
        `## ${severity.toUpperCase()} Impact`,
        "",
      );


      for (
        const impact of impacts
      ) {

        lines.push(
          `### ${impact.entity.id} - ${impact.entity.title}`,
          "",
          `Depth: ${impact.depth}`,
          "",
          "Path:",
        );


        for (
          const relation of impact.path
        ) {

          lines.push(
            `- ${relation.sourceId} → ${relation.type} → ${relation.targetId}`,
          );

        }


        lines.push("");

      }

    }


    return lines.join("\n");

  }

}
