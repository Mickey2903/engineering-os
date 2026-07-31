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

  it("renders a section heading", () => {
    const builder = new MarkdownReportBuilder();

    builder.section("Overview");

    expect(builder.build()).toBe("## Overview");
  });

  it("renders bullet items", () => {
    const builder = new MarkdownReportBuilder();

    builder.bullet("REQ-001");

    expect(builder.build()).toBe("- REQ-001");
  });

  it("renders metrics", () => {
    const builder = new MarkdownReportBuilder();

    builder.metric("Requirements", 42);

    expect(builder.build()).toBe("Requirements: **42**");
  });
});
