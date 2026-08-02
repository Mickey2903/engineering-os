import type { AIService } from "./AIService";
import type { AIResponse } from "../../models/AIResponse";
import type { EngineeringContextService } from "../knowledge/EngineeringContextService";
import type { EngineeringContextExporter } from "../knowledge/EngineeringContextExporter";


export class EngineeringAssistantService {

  public constructor(
    private readonly aiService: AIService,
    private readonly contextService: EngineeringContextService,
    private readonly exporter: EngineeringContextExporter,
  ) {}


  public async ask(
    question: string,
    objectId?: string,
  ): Promise<AIResponse> {

    let engineeringContext =
      "No engineering object context available.";


    if (objectId) {

      const context =
        this.contextService.generateContext(
          objectId,
        );


      const exported =
        this.exporter.export(
          context,
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


    return this.aiService.generate({
      prompt,
    });

  }

}
