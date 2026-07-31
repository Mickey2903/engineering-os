import type { EngineeringLink } from "../models/EngineeringLink";

export class EngineeringRelationshipService {
  private readonly links: EngineeringLink[] = [];

  public addLink(link: EngineeringLink): void {
    this.links.push(link);
  }

  public getLinks(): readonly EngineeringLink[] {
    return this.links;
  }


  public removeLinksForObject(
    id: string,
  ): void {
    const remaining = this.links.filter(
      (link) =>
        link.sourceId !== id &&
        link.targetId !== id,
    );

    this.links.length = 0;
    this.links.push(...remaining);
  }

  public getOutgoingLinks(
    id: string,
  ): readonly EngineeringLink[] {
    return this.links.filter(
      (link) => link.sourceId === id,
    );
  }

  public getIncomingLinks(
    id: string,
  ): readonly EngineeringLink[] {
    return this.links.filter(
      (link) => link.targetId === id,
    );
  }

  public findImpact(
    id: string,
  ): readonly string[] {
    const visited = new Set<string>();
    const queue = [id];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current || visited.has(current)) {
        continue;
      }

      visited.add(current);

      for (const link of this.getOutgoingLinks(current)) {
        queue.push(link.targetId);
      }
    }

    visited.delete(id);

    return [...visited];
  }
}
