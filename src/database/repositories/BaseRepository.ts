import type { EngineeringDatabase } from "../EngineeringDatabase";
import type { EngineeringEntity } from "../../models/EngineeringEntity";
import type { Repository } from "./Repository";

export abstract class BaseRepository<
  TEntity extends EngineeringEntity,
> implements Repository<TEntity> {
  public constructor(
    private readonly database: EngineeringDatabase,
    private readonly isEntityType: (entity: EngineeringEntity) => entity is TEntity,
  ) {}

  public findById(id: string): TEntity | undefined {
    const entity = this.database.findById(id);

    if (!entity || !this.isEntityType(entity)) {
      return undefined;
    }

    return entity;
  }

  public findAll(): readonly TEntity[] {
    return this.database.all().filter(this.isEntityType);
  }

  public exists(id: string): boolean {
    return this.findById(id) !== undefined;
  }

  public count(): number {
    return this.findAll().length;
  }

  protected findWhere(predicate: (entity: TEntity) => boolean): readonly TEntity[] {
    return this.findAll().filter(predicate);
  }
}
