import type { AIConfiguration } from "../../../models/AIConfiguration";
import type { AIRequest } from "../../../models/AIRequest";
import type { AIResponse } from "../../../models/AIResponse";
import type { AIProvider } from "../AIProvider";

export class OllamaProvider implements AIProvider {
	private readonly baseUrl =
  "http://localhost:11434";
  public constructor(
    private readonly configuration: AIConfiguration,
  ) {}

public async getAvailableModels(): Promise<string[]> {

  try {

    const response =
      await fetch(
        `${this.baseUrl}/api/tags`,
      );


    if (!response.ok) {

      return [];

    }


    const data =
      await response.json();


    return data.models
      ?.map(
        (model: { name: string }) =>
          model.name,
      )
      ?? [];

  }
  catch {

    return [];

  }

}
  public async generate(
    request: AIRequest,
  ): Promise<AIResponse> {

    const endpoint =
      this.configuration.endpoint ??
      "http://localhost:11434/api/chat";


    const response =
      await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model:
              this.configuration.model ??
              "llama3",

            messages: [
              {
                role:
                  "user",

                content:
                  request.prompt,
              },
            ],

            stream:
              false,
          }),
        },
      );


    if (!response.ok) {
      throw new Error(
        `Ollama request failed: ${response.status}`,
      );
    }


    const data =
      await response.json() as {
        message?: {
          content?: string;
        };
      };


    return {
      content:
        data.message?.content ??
        "",

      ...(this.configuration.model
        ? {
            model:
              this.configuration.model,
          }
        : {}),
    };

  }

}
