export interface FormattableEngineeringContext {

  root: {

    id: string;

    type: string;

    title: string;

    status?: string;

  };


  documentContent?: string;


  related: {

    id: string;

    type: string;

    title: string;

    status?: string;

  }[];

}



export class EngineeringContextFormatter {


  public format(
    contexts: FormattableEngineeringContext[],
  ): string {


    if (contexts.length === 0) {

      return "No engineering context available.";

    }


    const lines: string[] = [];


    lines.push(
      "Relevant engineering context:",
    );


    for (
      const context of contexts
    ) {


      lines.push(
        "",
        `Object: ${context.root.title}`,
        `ID: ${context.root.id}`,
        `Type: ${context.root.type}`,
      );


      if (context.root.status) {

  lines.push(
    `Status: ${context.root.status}`,
  );

}


if (context.documentContent) {

  lines.push(
    "",
    "Document content:",
    context.documentContent,
  );

}


      if (
        context.related.length > 0
      ) {

        lines.push(
          "Related objects:",
        );


        for (
          const related of context.related
        ) {

          lines.push(
            `- ${related.id}: ${related.title} (${related.type})`,
          );

        }

      }

    }


    return lines.join("\n");

  }

}
