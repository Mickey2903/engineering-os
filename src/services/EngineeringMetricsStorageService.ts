import type { EngineeringMetricSnapshot } from "../models/EngineeringMetricSnapshot";

export interface MetricsStorage {
  read(): Promise<string | undefined>;
  write(content: string): Promise<void>;
}

export class EngineeringMetricsStorageService {
  public constructor(
    private readonly storage: MetricsStorage,
  ) {}

  public async save(
    history: readonly EngineeringMetricSnapshot[],
  ): Promise<void> {
    await this.storage.write(
      JSON.stringify(history, null, 2),
    );
  }

  public async load(): Promise<readonly EngineeringMetricSnapshot[]> {
    const content = await this.storage.read();

    if (!content) {
      return [];
    }

    return JSON.parse(content) as EngineeringMetricSnapshot[];
  }
}
