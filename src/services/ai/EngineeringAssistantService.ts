import type { AIService } from "./AIService";
import type { AIResponse } from "../../models/AIResponse";
import type { EngineeringContextService } from "../knowledge/EngineeringContextService";
import type { EngineeringContextExporter } from "../knowledge/EngineeringContextExporter";
import type { EngineeringRelatedContextService } from "../knowledge/EngineeringRelatedContextService";
import type { EngineeringContextResolver } from "./EngineeringContextResolver";

export class EngineeringAssistantService {


public constructor(
  private readonly aiService: AIService,
  private readonly contextService: EngineeringContextService,
  private readonly exporter: EngineeringContextExporter,
  private readonly relatedContextService: EngineeringRelatedContextService,
  private readonly contextResolver: EngineeringContextResolver,
) {}


  public async getAvailableModels(): Promise<string[]> {

  const models =
    await this.aiService.getAvailableModels();

  return models;

}

public async ask(
  question: string,
  objectId?: string,
  model?: string,
): Promise<AIResponse> {


  let engineeringContext =
    "No engineering object context available.";


  const resolved =
    this.contextResolver.resolve(
      question,
      objectId,
    );


if (resolved.objects.length > 0) {


  const combinedContexts = [];


  for (const object of resolved.objects) {


    const context =
      this.contextService.generateContext(
        object.objectId,
      );


    const related =
      this.relatedContextService.findRelated(
        object.objectId,
      );


    combinedContexts.push(
      {
        ...context,

        related: [
          ...context.related,
          ...related,
        ],

      },
    );

  }


  engineeringContext =
    JSON.stringify(
      combinedContexts,
      null,
      2,
    );

}





  const prompt =
    `
Engineering context:
${engineeringContext}

Question:
${question}
`;


  return this.aiService.generate(
    {
      prompt,

      ...(model
        ? { model }
        : {}),
    },
  );
}
}

    
