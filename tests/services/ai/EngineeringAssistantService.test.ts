import { describe, expect, it } from "vitest";

import type { AIService } from "../../../src/services/ai/AIService";

import type { EngineeringContextService } from "../../../src/services/knowledge/EngineeringContextService";
import type { EngineeringContextExporter } from "../../../src/services/knowledge/EngineeringContextExporter";

import { EngineeringAssistantService } from "../../../src/services/ai/EngineeringAssistantService";




describe("EngineeringAssistantService", () => {


  it("sends engineering context to AI provider", async () => {

let lastRequest:
  unknown;


const aiService =
  {
    generate: async (
      request: unknown,
    ) => {

      lastRequest =
        request;


      return {
        content:
          "Test response",

        model:
          "fake-model",
      };

    },
  } as AIService;

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


    const relatedContextService = {

  findRelated: () => [],

} as any;
const assistant =
  new EngineeringAssistantService(
    aiService,
    contextService,
    exporter,
    relatedContextService,
  );


   const response =
  await assistant.ask(
    "Welke bestanden horen bij deze component?",
    "CMP-001",
  );;


    expect(response.content)
      .toBe("Test response");

     expect(lastRequest)
  .toBeDefined();


const request =
  lastRequest as {
    prompt: string;
  };


expect(request.prompt)
  .toContain("CMP-001");


expect(request.prompt)
  .toContain(
    "Welke bestanden horen bij deze component?",
  );
  });


});
