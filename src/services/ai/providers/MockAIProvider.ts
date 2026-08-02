import type { AIProvider } from "../AIProvider";
import type { AIRequest } from "../../../models/AIRequest";
import type { AIResponse } from "../../../models/AIResponse";


export class MockAIProvider implements AIProvider {

  public async generate(
    request: AIRequest,
  ): Promise<AIResponse> {

    return {
      content:
        `Mock response for: ${request.prompt}`,

      model:
        "mock",
    };
  }

}
