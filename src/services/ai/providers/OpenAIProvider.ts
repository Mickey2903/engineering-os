import type { AIConfiguration } from "../../../models/AIConfiguration";
import type { AIRequest } from "../../../models/AIRequest";
import type { AIResponse } from "../../../models/AIResponse";
import type { AIProvider } from "../AIProvider";


export class OpenAIProvider implements AIProvider {

  public constructor(
    private readonly configuration: AIConfiguration,
  ) {}
public async getAvailableModels(): Promise<string[]> {

  return [
    "gpt-4.1",
    "gpt-4.1-mini",
  ];

}

  public async checkConnection():
  Promise<boolean> {

  return true;

}

public async generate(
    request: AIRequest,
  ): Promise<AIResponse> {

    if (!this.configuration.apiKey) {
      throw new Error(
        "OpenAI API key is missing.",
      );
    }


    const endpoint =
      this.configuration.endpoint ??
      "https://api.openai.com/v1/chat/completions";


    const response =
      await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${this.configuration.apiKey}`,
          },

          body: JSON.stringify({
            model:
              this.configuration.model ??
              "gpt-5",

            messages: [
              {
                role:
                  "user",

                content:
                  request.prompt,
              },
            ],
          }),
        },
      );


    if (!response.ok) {
      throw new Error(
        `OpenAI request failed: ${response.status}`,
      );
    }


    const data =
      await response.json() as {
        choices?: {
          message?: {
            content?: string;
          };
        }[];
      };


    return {
  content:
    data.choices?.[0]?.message?.content ??
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
