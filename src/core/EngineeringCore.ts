import type { App, TFile } from "obsidian";
import { EngineeringDatabase } from "../database/EngineeringDatabase";
import { MetadataParser } from "../parser/MetadataParser";
import { VaultScanner } from "../scanner/VaultScanner";
import { EngineeringRelationshipIndexer } from "../services/EngineeringRelationshipIndexer";
import { EngineeringRelationshipService } from "../services/EngineeringRelationshipService";
import type { Logger } from "./Logger";
import { EngineeringProjectRepository } from "../repositories/EngineeringProjectRepository";
import { ImpactAnalysisService } from "../services/ImpactAnalysisService";

export class EngineeringCore {
public readonly impactAnalysis: ImpactAnalysisService;
  public readonly database = new EngineeringDatabase();
  public readonly projects = new EngineeringProjectRepository();

  private readonly scanner: VaultScanner;
  public readonly relationships: EngineeringRelationshipService;
  public readonly relationshipIndexer: EngineeringRelationshipIndexer;
  public readonly parser: MetadataParser;

  public constructor(
    private readonly app: App,
    private readonly logger: Logger,
  ) {
    this.relationships =
      new EngineeringRelationshipService();
this.impactAnalysis =
  new ImpactAnalysisService(
    this.relationships,
    this.database,
  );
    this.relationshipIndexer =
      new EngineeringRelationshipIndexer(
        this.relationships,
      );
      this.parser = new MetadataParser();

    this.scanner = new VaultScanner(
  this.app.vault,
  this.app.metadataCache,
  this.parser,
  this.database,
  this.projects,
  this.relationshipIndexer,
  this.logger,
);
  }

  public initialize(): void {
  const result = this.scanner.scanAll();

  this.rebuildRelationships();

  this.logger.info(
    "Initial Vault scan complete.",
    result,
  );
}
private rebuildRelationships(): void {
  this.relationships.clear();

  console.log(
    "[Relationship rebuild] objects:",
    this.database.all().map(o => o.id),
  );

  for (const object of this.database.all()) {
    this.relationshipIndexer.indexObject(object);
  }

  console.log(
    "[Relationship rebuild] links:",
    this.relationships.getLinks(),
  );
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
