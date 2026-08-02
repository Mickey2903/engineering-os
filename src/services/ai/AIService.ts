import type { AIRequest } from "../../models/AIRequest";
import type { AIResponse } from "../../models/AIResponse";

import type { AIConfigurationService } from "./AIConfigurationService";
import { AIProviderFactory } from "./AIProviderFactory";


export class AIService {

  public constructor(
    private readonly configurationService:
      AIConfigurationService,
  ) {}


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
