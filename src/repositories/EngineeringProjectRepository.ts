import type { EngineeringProject } from "../models/EngineeringProject";

export class EngineeringProjectRepository {
  private readonly projects =
    new Map<string, EngineeringProject>();

  public add(
    project: EngineeringProject,
  ): void {
    this.projects.set(
      project.id,
      project,
    );
  }

  public remove(
    id: string,
  ): boolean {
    return this.projects.delete(id);
  }

  public findById(
    id: string,
  ): EngineeringProject | undefined {
    return this.projects.get(id);
  }

  public findAll(): readonly EngineeringProject[] {
    return [
      ...this.projects.values(),
    ];
  }

  public count(): number {
    return this.projects.size;
  }

  public clear(): void {
    this.projects.clear();
  }
}
