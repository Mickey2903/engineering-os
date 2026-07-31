import type { EngineeringMetricSnapshot } from "../models/EngineeringMetricSnapshot";

export class EngineeringMetricsHistoryService {
  private readonly snapshots: EngineeringMetricSnapshot[];

  public constructor(
    initialSnapshots: readonly EngineeringMetricSnapshot[] = [],
  ) {
    this.snapshots = [...initialSnapshots];
  }

  public addSnapshot(snapshot: EngineeringMetricSnapshot): void {
    this.snapshots.push(snapshot);
  }

  public getHistory(): readonly EngineeringMetricSnapshot[] {
    return this.snapshots;
  }

  public latest(): EngineeringMetricSnapshot | undefined {
    return this.snapshots.at(-1);
  }
}
