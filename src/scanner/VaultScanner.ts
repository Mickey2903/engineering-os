import type { MetadataCache, TFile, Vault } from "obsidian";
import type { Logger } from "../core/Logger";
import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { MetadataParser } from "../parser/MetadataParser";
import type { EngineeringProjectRepository } from "../repositories/EngineeringProjectRepository";
import { ProjectMetadataParser } from "../parser/ProjectMetadataParser";
import type { EngineeringRelationshipIndexer } from "../services/EngineeringRelationshipIndexer";

export interface ScanResult {
  readonly scanned: number;
  readonly indexed: number;
  readonly errors: number;
}

export class VaultScanner {
  private readonly projectParser = new ProjectMetadataParser();

public constructor(
  private readonly vault: Vault,
  private readonly metadataCache: MetadataCache,
  private readonly parser: MetadataParser,
  private readonly database: EngineeringDatabase,
  private readonly projects: EngineeringProjectRepository,
  private readonly relationshipIndexer: EngineeringRelationshipIndexer,
  private readonly logger: Logger,
) {}

  public scanFile(file: TFile): void {
  if (file.extension !== "md") return;

  const metadata =
    this.metadataCache.getFileCache(file);

  const document =
    this.parser.parse(file, metadata);

  this.database.upsert(document);
  this.relationshipIndexer.indexObject(document);

  const frontmatter =
    (metadata?.frontmatter ?? {}) as Record<string, unknown>;

  const project =
    this.projectParser.parse(frontmatter);

  if (project) {
    this.projects.add({
      id: project.id,
      name: project.name,
      description: project.description ?? "",
      type: project.projectType,
      status:
        project.status as
          | "concept"
          | "development"
          | "testing"
          | "production"
          | "archived",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

  public scanAll(): ScanResult {
    const files = this.vault.getMarkdownFiles();
    let indexed = 0;
    let errors = 0;

    this.database.clear();
    this.projects.clear();

    for (const file of files) {
      try {
        this.scanFile(file);
        indexed += 1;
      } catch (error: unknown) {
        errors += 1;
        this.logger.error(`Could not index ${file.path}`, error);
      }
    }

    return { scanned: files.length, indexed, errors };
  }

  public remove(path: string): void {
    this.database.removeByPath(path);
  }
}
