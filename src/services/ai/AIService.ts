import type { AIRequest } from "../../models/AIRequest";
import type { AIResponse } from "../../models/AIResponse";

import type { AIConfigurationService } from "./AIConfigurationService";
import { AIProviderFactory } from "./AIProviderFactory";
import type { AIProvider } from "./AIProvider";

export class AIService {

  public constructor(
  private readonly configurationService: AIConfigurationService,
  private readonly provider?: AIProvider,
) {}
public async getAvailableModels(): Promise<string[]> {

  if (!this.provider) {
    return [];
  }

  return this.provider.getAvailableModels();

}
  public async generate(
    request: AIRequest,
  ): Promise<AIResponse> {

    const configuration =
      this.configurationService.get();


    const provider =
      AIProviderFactory.create(
        configuration,
      );


    return provider.generate(
      request,
    );

  }

}
