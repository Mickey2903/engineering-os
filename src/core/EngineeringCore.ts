import type { App, TFile } from "obsidian";
import { EngineeringDatabase } from "../database/EngineeringDatabase";
import { MetadataParser } from "../parser/MetadataParser";
import { VaultScanner } from "../scanner/VaultScanner";
import type { Logger } from "./Logger";

export class EngineeringCore {
  public readonly database = new EngineeringDatabase();
  private readonly scanner: VaultScanner;

  public constructor(
    private readonly app: App,
    private readonly logger: Logger,
  ) {
    this.scanner = new VaultScanner(
      app.vault,
      app.metadataCache,
      new MetadataParser(),
      this.database,
      logger,
    );
  }

  public initialize(): void {
    const result = this.scanner.scanAll();
    this.logger.info("Initial Vault scan complete.", result);
  }

  public updateFile(file: TFile): void {
    this.scanner.scanFile(file);
  }

  public removeFile(path: string): void {
    this.scanner.remove(path);
  }

  public shutdown(): void {
    this.database.clear();
  }
}
