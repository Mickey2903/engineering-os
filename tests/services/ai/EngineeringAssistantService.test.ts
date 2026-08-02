import { describe, expect, it } from "vitest";

import type { AIProvider } from "../../../src/services/ai/AIProvider";
import type { AIRequest } from "../../../src/models/AIRequest";
import type { AIResponse } from "../../../src/models/AIResponse";

import type { EngineeringContextService } from "../../../src/services/knowledge/EngineeringContextService";
import type { EngineeringContextExporter } from "../../../src/services/knowledge/EngineeringContextExporter";

import { EngineeringAssistantService } from "../../../src/services/ai/EngineeringAssistantService";


class FakeAIProvider implements AIProvider {

  public lastRequest?: AIRequest;


  public async generate(
    request: AIRequest,
  ): Promise<AIResponse> {

    this.lastRequest =
      request;


    return {
      content:
        "Test response",

      model:
        "fake-model",
    };
  }

}


describe("EngineeringAssistantService", () => {


  it("sends engineering context to AI provider", async () => {

    const provider =
      new FakeAIProvider();


    const contextService = {

      generateContext: () => ({
        root: {
          id: "CMP-001",
          type: "component",
          title: "CPU Module",
          status: "active",
          tags: [],
          sourcePath: "Components/CMP-001.md",
          links: [],
          modifiedTime: Date.now(),
          metadata: {},
          lifecycle: "prototype",
        },

        related: [],
      }),

    } as unknown as EngineeringContextService;


    const exporter = {

      export: () => ({
        generatedAt:
          Date.now(),

        rootId:
          "CMP-001",

        rootType:
          "component",

        objects: [
          {
            id: "CMP-001",
            type: "component",
            title: "CPU Module",
            status: "active",
          },
        ],
      }),

    } as unknown as EngineeringContextExporter;


    const assistant =
      new EngineeringAssistantService(
        provider,
        contextService,
        exporter,
      );


    const response =
      await assistant.ask(
        "CMP-001",
        "Welke bestanden horen bij deze component?",
      );


    expect(response.content)
      .toBe("Test response");


    expect(provider.lastRequest)
      .toBeDefined();


    expect(provider.lastRequest?.prompt)
      .toContain("CMP-001");


    expect(provider.lastRequest?.prompt)
      .toContain(
        "Welke bestanden horen bij deze component?",
      );

  });


});
