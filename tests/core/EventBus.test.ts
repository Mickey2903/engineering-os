import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../../src/core/EventBus";

interface TestEvents {
  changed: { id: string };
}

describe("EventBus", () => {
  it("emits typed payloads", async () => {
    const bus = new EventBus<TestEvents>();
    const handler = vi.fn();

    bus.on("changed", handler);
    await bus.emit("changed", { id: "SYS-PWR-001" });

    expect(handler).toHaveBeenCalledWith({ id: "SYS-PWR-001" });
  });

  it("supports unsubscribe", async () => {
    const bus = new EventBus<TestEvents>();
    const handler = vi.fn();
    const unsubscribe = bus.on("changed", handler);

    unsubscribe();
    await bus.emit("changed", { id: "SYS-PWR-001" });

    expect(handler).not.toHaveBeenCalled();
  });
});
