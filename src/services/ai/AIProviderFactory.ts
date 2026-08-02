import type { AIConfiguration } from "../../models/AIConfiguration";
import type { AIProvider } from "./AIProvider";

import { MockAIProvider } from "./providers/MockAIProvider";
import { OpenAIProvider } from "./providers/OpenAIProvider";


export class AIProviderFactory {

  public static create(
    configuration: AIConfiguration,
  ): AIProvider {

    switch (configuration.provider) {

      case "mock":
        return new MockAIProvider();


      case "openai":
  return new OpenAIProvider(
    configuration,
  );


      case "ollama":
        throw new Error(
          "Ollama provider is not implemented yet.",
        );

    }

  }

}
