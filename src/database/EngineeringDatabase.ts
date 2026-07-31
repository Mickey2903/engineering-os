import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { EngineeringObjectType } from "../models/EngineeringObject";
export class EngineeringDatabase {
  private readonly entitiesById = new Map<string, EngineeringEntity>();
  private readonly idByPath = new Map<string, string>();
  public upsert(entity: EngineeringEntity): void {
    const oldId = this.idByPath.get(entity.sourcePath);
    if (oldId && oldId !== entity.id) this.entitiesById.delete(oldId);
    const duplicate = this.entitiesById.get(entity.id);
    if (duplicate && duplicate.sourcePath !== entity.sourcePath)
      throw new Error(
        `Duplicate engineering ID "${entity.id}" in "${duplicate.sourcePath}" and "${entity.sourcePath}".`,
      );
    this.entitiesById.set(entity.id, entity);
    this.idByPath.set(entity.sourcePath, entity.id);
  }
  public removeByPath(path: string): boolean {
    const id = this.idByPath.get(path);
    if (!id) return false;
    this.idByPath.delete(path);
    return this.entitiesById.delete(id);
  }
  public findById(id: string): EngineeringEntity | undefined {
    return this.entitiesById.get(id);
  }
  public findByType(type: EngineeringObjectType): readonly EngineeringEntity[] {
    return this.all().filter((entity) => entity.type === type);
  }
  public all(): readonly EngineeringEntity[] {
    return [...this.entitiesById.values()];
  }
  public count(): number {
    return this.entitiesById.size;
  }
  public clear(): void {
    this.entitiesById.clear();
    this.idByPath.clear();
  }
}
