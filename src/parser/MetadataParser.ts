import type { CachedMetadata, TFile } from "obsidian";
import type { EngineeringDocument, EngineeringDocumentType } from "../models/EngineeringDocument";

const supportedTypes = new Set<EngineeringDocumentType>([
  "requirement",
  "verification",
  "component",
  "adr",
  "risk",
  "architecture",
]);

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function parseType(value: unknown): EngineeringDocumentType {
  const type = asString(value)?.toLowerCase() as EngineeringDocumentType | undefined;
  return type && supportedTypes.has(type) ? type : "unknown";
}

export class MetadataParser {
  public parse(file: TFile, cache: CachedMetadata | null): EngineeringDocument {
    const frontmatter = cache?.frontmatter ?? {};
    const id = asString(frontmatter.id) ?? file.basename;
    const title = asString(frontmatter.title) ?? file.basename;
    const status = asString(frontmatter.status);
    const links = (cache?.links ?? []).map((link) => link.link);

    return {
      id,
      title,
      type: parseType(frontmatter.type),
      ...(status ? { status } : {}),
      sourcePath: file.path,
      links,
      metadata: { ...frontmatter },
      modifiedTime: file.stat.mtime,
    };
  }
}
