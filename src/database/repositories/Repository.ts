export interface Repository<TEntity> {
  findById(id: string): TEntity | undefined;

  findAll(): readonly TEntity[];

  exists(id: string): boolean;

  count(): number;
}
