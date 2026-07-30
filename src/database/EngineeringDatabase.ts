import type { EngineeringDocument } from "../models/EngineeringDocument";

export class EngineeringDatabase {
  private readonly documentsById = new Map<string, EngineeringDocument>();
  private readonly idByPath = new Map<string, string>();

  public upsert(document: EngineeringDocument): void {
    const existingIdForPath = this.idByPath.get(document.sourcePath);
    if (existingIdForPath && existingIdForPath !== document.id) {
      this.documentsById.delete(existingIdForPath);
    }

    const existingDocument = this.documentsById.get(document.id);
    if (existingDocument && existingDocument.sourcePath !== document.sourcePath) {
      throw new Error(
        `Duplicate engineering ID "${document.id}" in "${existingDocument.sourcePath}" and "${document.sourcePath}".`,
      );
    }

    this.documentsById.set(document.id, document);
    this.idByPath.set(document.sourcePath, document.id);
  }

  public removeByPath(path: string): boolean {
    const id = this.idByPath.get(path);
    if (!id) return false;

    this.idByPath.delete(path);
    return this.documentsById.delete(id);
  }

  public findById(id: string): EngineeringDocument | undefined {
    return this.documentsById.get(id);
  }

  public all(): readonly EngineeringDocument[] {
    return [...this.documentsById.values()];
  }

  public count(): number {
    return this.documentsById.size;
  }

  public clear(): void {
    this.documentsById.clear();
    this.idByPath.clear();
  }
}
