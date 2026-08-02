import { describe, expect, it, vi } from "vitest";

import { OllamaProvider } from "../../../src/services/ai/providers/OllamaProvider";


describe("OllamaProvider", () => {

  it("sends request to configured Ollama endpoint and parses response", async () => {

    const fetchMock =
      vi.fn()
        .mockResolvedValue({
          ok: true,

          json: async () => ({
            message: {
              content:
                "Ollama test answer",
            },
          }),

        });


    vi.stubGlobal(
      "fetch",
      fetchMock,
    );


    const provider =
      new OllamaProvider({
        provider: "ollama",

        endpoint:
          "http://localhost:11434/api/chat",

        model:
          "llama3",
      });


    const response =
      await provider.generate({
        prompt:
          "Test prompt",
      });


    expect(response.content)
      .toBe(
        "Ollama test answer",
      );


    expect(response.model)
      .toBe(
        "llama3",
      );


    expect(fetchMock)
      .toHaveBeenCalledTimes(1);


    const request =
      fetchMock.mock.calls[0];


    expect(request?.[0])
      .toBe(
        "http://localhost:11434/api/chat",
      );


    const options =
      request?.[1] as RequestInit;


    const body =
      JSON.parse(
        options.body as string,
      );


    expect(body.model)
      .toBe(
        "llama3",
      );


    expect(body.messages[0].content)
      .toBe(
        "Test prompt",
      );


    expect(body.stream)
      .toBe(
        false,
      );

  });


  it("uses default Ollama endpoint and model", async () => {

    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValue({
          ok: true,

          json: async () => ({
            message: {
              content:
                "Default response",
            },
          }),

        }),
    );


    const provider =
      new OllamaProvider({
        provider: "ollama",
      });


    const response =
      await provider.generate({
        prompt:
          "Default test",
      });


    expect(response.content)
      .toBe(
        "Default response",
      );

  });

});
