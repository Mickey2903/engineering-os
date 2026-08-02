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

public async getAvailableModels():
Promise<string[]> {

  try {

    const response =
      await fetch(
        `${this.configuration.endpoint ?? this.baseUrl}/api/tags`,
      );


    if (!response.ok) {
      return [];
    }


    const data =
      await response.json();


    return (
      data.models
        ?.map(
          (model: { name: string }) =>
            model.name,
        )
        ?? []
    );


  }
  catch(error) {

    console.error(
      "Ollama model loading failed",
      error,
    );

    return [];

  }

}
public async checkConnection():
  Promise<boolean> {

  try {

    const url =
  this.configuration.endpoint ??
  this.baseUrl;


const response =
  await fetch(
    `${url}/api/tags`,
  );


    return response.ok;

  }
  catch {

    return false;

  }

}

  public async generate(
    request: AIRequest,
  ): Promise<AIResponse> {

    const endpoint =
  `${this.configuration.endpoint ?? this.baseUrl}/api/chat`;

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
  "qwen2.5-coder:7b",
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
