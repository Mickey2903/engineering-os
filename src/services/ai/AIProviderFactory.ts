import type { AIConfiguration } from "../../models/AIConfiguration";
import type { AIProvider } from "./AIProvider";

import { MockAIProvider } from "./providers/MockAIProvider";


export class AIProviderFactory {

  public static create(
    configuration: AIConfiguration,
  ): AIProvider {

    switch (configuration.provider) {

      case "mock":
        return new MockAIProvider();


      case "openai":
        throw new Error(
          "OpenAI provider is not implemented yet.",
        );


      case "ollama":
        throw new Error(
          "Ollama provider is not implemented yet.",
        );

    }

  }

}
