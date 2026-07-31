import type { App, TFile } from "obsidian";
import { EngineeringDatabase } from "../database/EngineeringDatabase";
import { MetadataParser } from "../parser/MetadataParser";
import { VaultScanner } from "../scanner/VaultScanner";
import { EngineeringRelationshipIndexer } from "../services/EngineeringRelationshipIndexer";
import { EngineeringRelationshipService } from "../services/EngineeringRelationshipService";
import type { Logger } from "./Logger";

export class EngineeringCore {
  public readonly database = new EngineeringDatabase();
  private readonly scanner: VaultScanner;
  public readonly relationships: EngineeringRelationshipService;
  private readonly relationshipIndexer: EngineeringRelationshipIndexer;

  public constructor(
    private readonly app: App,
    private readonly logger: Logger,
  ) {
    this.relationships =
      new EngineeringRelationshipService();

    this.relationshipIndexer =
      new EngineeringRelationshipIndexer(
        this.relationships,
      );

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

    const object =
      this.database.findByPath(file.path);

    if (object) {
      this.relationshipIndexer.indexObject(object);
    }
  }

  public removeFile(path: string): void {
    this.scanner.remove(path);
  }

  public shutdown(): void {
    this.database.clear();
  }
}
