import { Notice, Plugin, TFile } from "obsidian";
import { EngineeringCore } from "./src/core/EngineeringCore";
import { ConsoleLogger } from "./src/core/Logger";

export default class PlcEngineeringToolsPlugin extends Plugin {
  private core: EngineeringCore | undefined;

  public override onload(): void {
    const logger = new ConsoleLogger("PLC Engineering Tools");
    this.core = new EngineeringCore(this.app, logger);

    this.app.workspace.onLayoutReady(() => {
      this.core?.initialize();
    });

    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.core?.updateFile(file);
      }),
    );

    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof TFile) {
          this.core?.removeFile(file.path);
        }
      }),
    );

    this.addCommand({
      id: "show-engineering-index-status",
      name: "Show engineering index status",
      callback: () => {
        const count = this.core?.database.count() ?? 0;
        new Notice(`Engineering index contains ${String(count)} Markdown documents.`);
      },
    });

    logger.info("Plugin loaded.");
  }

  public override onunload(): void {
    this.core?.shutdown();
    this.core = undefined;
  }
}
