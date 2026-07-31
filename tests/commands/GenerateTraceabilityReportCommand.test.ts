import { describe, expect, it, vi } from "vitest";
import { GenerateTraceabilityReportCommand } from "../../src/commands/GenerateTraceabilityReportCommand";
import type { TraceabilitySnapshot } from "../../src/models/TraceabilitySnapshot";

describe("GenerateTraceabilityReportCommand", () => {
  it("generates and writes the traceability report", async () => {
    const snapshot: TraceabilitySnapshot = {
      requirementCount: 10,
      tracedRequirementCount: 8,
      missingComponentCount: 2,
      missingVerificationCount: 3,
    };

    const createSnapshot = vi.fn().mockReturnValue(snapshot);

    const services = {
      traceability: {
        createSnapshot,
      },
    };

    const render = vi.fn().mockReturnValue("# Traceability Report");
    const write = vi.fn().mockResolvedValue(undefined);

    const command = new GenerateTraceabilityReportCommand(services, { render }, { write });

    await command.execute();

    expect(createSnapshot).toHaveBeenCalledOnce();
    expect(render).toHaveBeenCalledWith(snapshot);
    expect(write).toHaveBeenCalledWith(
      "Engineering/Reports/Traceability Report.md",
      "# Traceability Report",
    );
  });
});
