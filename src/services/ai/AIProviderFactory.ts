import type { AIConfiguration } from "../../models/AIConfiguration";
import type { AIProvider } from "./AIProvider";

import { MockAIProvider } from "./providers/MockAIProvider";
import { OpenAIProvider } from "./providers/OpenAIProvider";
import { OllamaProvider } from "./providers/OllamaProvider";


export class AIProviderFactory {

  public static create(
    configuration: AIConfiguration,
  ): AIProvider {

    switch (configuration.provider) {

      case "mock":
  return new MockAIProvider(
    configuration,
  );


      case "openai":
  return new OpenAIProvider(
    configuration,
  );


      case "ollama":
  return new OllamaProvider(
    configuration,
  );

    }

  }

}
