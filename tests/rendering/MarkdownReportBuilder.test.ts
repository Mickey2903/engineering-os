import { describe, expect, it } from "vitest";
import { MarkdownReportBuilder } from "../../src/rendering/MarkdownReportBuilder";

describe("MarkdownReportBuilder", () => {
  it("builds a simple markdown document", () => {
    const builder = new MarkdownReportBuilder();

    builder.heading("Example");
    builder.blank();
    builder.line("Hello");

    expect(builder.build()).toBe(["# Example", "", "Hello"].join("\n"));
  });
});
