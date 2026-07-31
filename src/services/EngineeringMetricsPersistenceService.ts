import type { EngineeringMetricsSnapshotService } from "./EngineeringMetricsSnapshotService";
import type { EngineeringMetricsHistoryService } from "./EngineeringMetricsHistoryService";
import type { EngineeringMetricsStorageService } from "./EngineeringMetricsStorageService";

export class EngineeringMetricsPersistenceService {
  public constructor(
    private readonly snapshotService: EngineeringMetricsSnapshotService,
    private readonly historyService: EngineeringMetricsHistoryService,
    private readonly storageService: EngineeringMetricsStorageService,
  ) {}

  public async capture(date: string): Promise<void> {
    const snapshot =
      this.snapshotService.createSnapshot(date);

    this.historyService.addSnapshot(snapshot);

    await this.storageService.save(
      this.historyService.getHistory(),
    );
  }
}
