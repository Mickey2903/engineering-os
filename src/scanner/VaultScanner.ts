import type { MetadataCache, TFile, Vault } from "obsidian";
import type { Logger } from "../core/Logger";
import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { MetadataParser } from "../parser/MetadataParser";
import type { EngineeringAssetScanner } from "../services/EngineeringAssetScanner";

export interface ScanResult {
  readonly scanned: number;
  readonly indexed: number;
  readonly errors: number;
}

export class VaultScanner {
  public constructor(
  private readonly vault: Vault,
  private readonly metadataCache: MetadataCache,
  private readonly parser: MetadataParser,
  private readonly database: EngineeringDatabase,
  private readonly logger: Logger,
  private readonly assetScanner: EngineeringAssetScanner,
) {}
  public scanFile(file: TFile): void {
    if (file.extension !== "md") return;

    const metadata = this.metadataCache.getFileCache(file);
    const document = this.parser.parse(file, metadata);
    this.database.upsert(document);
  }
  public scanAssetFile(file: TFile): void {

  const asset =
    this.assetScanner.scanFile(
      file.path,
    );

  this.database.upsert(asset);
}

  public scanAll(): ScanResult {
    const files =
  this.vault.getFiles();
    let indexed = 0;
    let errors = 0;

    this.database.clear();

    for (const file of files) {
  try {

    if (file.extension === "md") {
      this.scanFile(file);
    } else {
      this.scanAssetFile(file);
    }

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
