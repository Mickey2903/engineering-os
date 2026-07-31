import { describe, expect, it, vi } from "vitest";
import { RunHealthCheckCommand } from "../../src/commands/RunHealthCheckCommand";

describe("RunHealthCheckCommand", () => {
  it("generates and writes the engineering health report", async () => {
    const report = {
      brokenLinks: [],
      orphanEntities: [],
      entitiesWithoutIncomingLinks: [],
      entitiesWithoutOutgoingLinks: [],
      duplicateRelationships: [],
    };

    const healthReport = vi.fn().mockReturnValue(report);

    const services = {
      health: {
        healthReport,
      },
    };

    const render = vi.fn().mockReturnValue("# Engineering Health Report");
    const write = vi.fn().mockResolvedValue(undefined);

    const command = new RunHealthCheckCommand(services, { render }, { write });

    await command.execute();

    expect(healthReport).toHaveBeenCalledOnce();
    expect(render).toHaveBeenCalledWith(report);
    expect(write).toHaveBeenCalledWith(
      "Engineering/Reports/Health Report.md",
      "# Engineering Health Report",
    );
  });
});
