import { describe, expect, it, vi } from "vitest";

import { OpenAIProvider } from "../../../src/services/ai/providers/OpenAIProvider";


describe("OpenAIProvider", () => {

  it("throws when API key is missing", async () => {

    const provider =
      new OpenAIProvider({
        provider: "openai",
      });


    await expect(
      provider.generate({
        prompt: "test",
      }),
    ).rejects.toThrow(
      "OpenAI API key is missing.",
    );

  });


  it("sends request and parses response", async () => {

    const fetchMock =
      vi.fn()
        .mockResolvedValue({
          ok: true,

          json: async () => ({
            choices: [
              {
                message: {
                  content:
                    "Test answer",
                },
              },
            ],
          }),

        });


    vi.stubGlobal(
      "fetch",
      fetchMock,
    );


    const provider =
      new OpenAIProvider({
        provider: "openai",

        apiKey:
          "test-key",

        model:
          "test-model",
      });


    const response =
      await provider.generate({
        prompt:
          "Hello AI",
      });


    expect(response.content)
      .toBe(
        "Test answer",
      );


    expect(response.model)
      .toBe(
        "test-model",
      );


    expect(fetchMock)
      .toHaveBeenCalledTimes(1);


    const request =
      fetchMock.mock.calls[0];


    expect(request?.[0])
      .toBe(
        "https://api.openai.com/v1/chat/completions",
      );


    const options =
      request?.[1] as RequestInit;


    expect(options.headers)
      .toMatchObject({
        Authorization:
          "Bearer test-key",
      });


  });


});
