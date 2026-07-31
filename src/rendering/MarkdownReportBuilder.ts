export class MarkdownReportBuilder {
  private readonly lines: string[] = [];

  public heading(text: string): void {
    this.lines.push(`# ${text}`);
  }

  public line(text: string): void {
    this.lines.push(text);
  }

  public section(title: string): void {
    this.lines.push(`## ${title}`);
  }

  public blank(): void {
    this.lines.push("");
  }

  public build(): string {
    return this.lines.join("\n");
  }
}
