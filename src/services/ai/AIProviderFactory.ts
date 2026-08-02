import type { AIProvider } from "./AIProvider";
import { MockAIProvider } from "./providers/MockAIProvider";


export type AIProviderType =
  | "mock";


export class AIProviderFactory {

  public static create(
    type: AIProviderType,
  ): AIProvider {

    switch (type) {

      case "mock":
        return new MockAIProvider();

    }

  }

}
