import type { AIProvider } from "../AIProvider";
import type { AIRequest } from "../../../models/AIRequest";
import type { AIResponse } from "../../../models/AIResponse";
import type { AIConfiguration } from "../../../models/AIConfiguration";


export class MockAIProvider implements AIProvider {

  public constructor(
    private readonly configuration: AIConfiguration,
  ) {}

public async getAvailableModels(): Promise<string[]> {

  return [
    "mock-model",
  ];

}
  public async generate(
    request: AIRequest,
  ): Promise<AIResponse> {

    return {
      content:
        `Mock response for: ${request.prompt}`,

      ...(this.configuration.model
        ? {
            model:
              this.configuration.model,
          }
        : {
            model:
              "mock",
          }),
    };

  }

}
