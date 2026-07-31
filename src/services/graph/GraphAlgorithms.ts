import type { RelationshipGraph } from "../relationships/RelationshipGraph";

export class GraphAlgorithms {
  public constructor(private readonly graph: RelationshipGraph) {}

  public findReachable(startId: string): readonly string[] {
    if (!this.graph.hasNode(startId)) {
      return [];
    }

    const visited = new Set<string>();
    const queue: string[] = [startId];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current === undefined || visited.has(current)) {
        continue;
      }

      visited.add(current);

      for (const neighbor of this.graph.neighbors(current)) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    visited.delete(startId);

    return [...visited];
  }

  public shortestPath(startId: string, targetId: string): readonly string[] {
    if (startId === targetId) {
      return [startId];
    }

    if (!this.graph.hasNode(startId) || !this.graph.hasNode(targetId)) {
      return [];
    }

    const visited = new Set<string>([startId]);
    const queue: string[][] = [[startId]];

    while (queue.length > 0) {
      const currentPath = queue.shift();

      if (currentPath === undefined) {
        continue;
      }

      const currentId = currentPath[currentPath.length - 1];

      if (currentId === undefined) {
        continue;
      }

      for (const neighbor of this.graph.neighbors(currentId)) {
        if (visited.has(neighbor)) {
          continue;
        }

        const nextPath = [...currentPath, neighbor];

        if (neighbor === targetId) {
          return nextPath;
        }

        visited.add(neighbor);
        queue.push(nextPath);
      }
    }

    return [];
  }

  public findAllPaths(startId: string, targetId: string): readonly (readonly string[])[] {
    if (!this.graph.hasNode(startId) || !this.graph.hasNode(targetId)) {
      return [];
    }

    const paths: string[][] = [];

    const visit = (
      currentId: string,
      currentPath: readonly string[],
      visited: ReadonlySet<string>,
    ): void => {
      if (currentId === targetId) {
        paths.push([...currentPath]);
        return;
      }

      for (const neighbor of this.graph.neighbors(currentId)) {
        if (visited.has(neighbor)) {
          continue;
        }

        visit(neighbor, [...currentPath, neighbor], new Set([...visited, neighbor]));
      }
    };

    visit(startId, [startId], new Set([startId]));

    return paths;
  }
}
