import type { AIService } from "./AIService";
import type { AIResponse } from "../../models/AIResponse";
import type { EngineeringContextService } from "../knowledge/EngineeringContextService";
import type { EngineeringContextExporter } from "../knowledge/EngineeringContextExporter";
import type { EngineeringRelatedContextService } from "../knowledge/EngineeringRelatedContextService";


export class EngineeringAssistantService {


  public constructor(
    private readonly aiService: AIService,
    private readonly contextService: EngineeringContextService,
    private readonly exporter: EngineeringContextExporter,
    private readonly relatedContextService: EngineeringRelatedContextService,
  ) {}


  public async getAvailableModels(): Promise<string[]> {

    return this.aiService.getAvailableModels();

  }


  public async ask(
    question: string,
    objectId?: string,
    model?: string,
  ): Promise<AIResponse> {


    let engineeringContext =
      "No engineering object context available.";


    if (objectId) {

      const context =
        this.contextService.generateContext(
          objectId,
        );


      const related =
        this.relatedContextService.findRelated(
          objectId,
        );


      const exported =
        this.exporter.export(
          {
            ...context,

            related: [
              ...context.related,
              ...related,
            ],
          },
        );


      engineeringContext =
        JSON.stringify(
          exported,
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
