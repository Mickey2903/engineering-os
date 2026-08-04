import { describe, expect, it, vi } from "vitest";
import { AnalyzeImpactCommand } from "../../src/commands/AnalyzeImpactCommand";


describe("AnalyzeImpactCommand", () => {


  it("generates impact report", async () => {


    const writer = {
      write:
        vi.fn()
          .mockResolvedValue(undefined),
    };


    const renderer = {
      render:
        vi.fn()
          .mockReturnValue(
            "# Impact Report",
          ),
    };


    const impactService = {

      analyze:
        vi.fn()
          .mockReturnValue({
            root: {
              id: "CMP-001",
            },

            impacted: [],
          }),

    };


    const command =
      new AnalyzeImpactCommand(
        impactService as any,
        renderer as any,
        writer,
      );


    await command.execute(
      "CMP-001",
    );


    expect(renderer.render)
      .toHaveBeenCalled();


    expect(writer.write)
      .toHaveBeenCalledWith(
        "Engineering/Reports/Impact Analysis CMP-001.md",
        "# Impact Report",
      );

  });

});
