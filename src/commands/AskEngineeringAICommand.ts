import type { EngineeringAssistantService } from "../services/ai/EngineeringAssistantService";


export class AskEngineeringAICommand {

  public constructor(
    private readonly assistant:
      EngineeringAssistantService,
  ) {}


  public async execute(
    objectId: string,
    question: string,
  ): Promise<string> {

    const response =
      await this.assistant.ask(
        objectId,
        question,
      );


    return response.content;

  }

}
