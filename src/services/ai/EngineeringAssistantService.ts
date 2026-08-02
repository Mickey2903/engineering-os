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
    objectId: string,
    question: string,
  ): Promise<AIResponse> {

    const context =
      this.contextService.generateContext(
        objectId,
      );


    const exported =
      this.exporter.export(
        context,
      );


    const prompt =
      `
Engineering context:
${JSON.stringify(exported, null, 2)}

Question:
${question}
`;


    return this.aiService.generate({
      prompt,
    });

  }

}
