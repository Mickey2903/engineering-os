import { TFile, type Vault } from "obsidian";
import type { MetricsStorage } from "../services/EngineeringMetricsStorageService";

export class ObsidianMetricsStorage implements MetricsStorage {
  private readonly path =
    "Engineering/History/Engineering Metrics.json";

  public constructor(
    private readonly vault: Vault,
  ) {}

  public async read(): Promise<string | undefined> {
    const file = this.vault.getAbstractFileByPath(this.path);

    if (!(file instanceof TFile)) {
      return undefined;
    }

    return this.vault.read(file);
  }

  public async write(content: string): Promise<void> {
    const existing = this.vault.getAbstractFileByPath(this.path);

    if (existing instanceof TFile) {
      await this.vault.modify(existing, content);
      return;
    }

    await this.vault.create(this.path, content);
  }
}
