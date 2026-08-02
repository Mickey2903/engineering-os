import {
  App,
  PluginSettingTab,
  Setting,
} from "obsidian";

import type { EngineeringOSSettings } from "./EngineeringOSSettings";


export class EngineeringOSSettingTab extends PluginSettingTab {

  public constructor(
    app: App,
    plugin: {
      settings: EngineeringOSSettings;
      saveSettings(): Promise<void>;
    },
  ) {
    super(app, plugin as never);

    this.plugin =
      plugin;
  }


  private readonly plugin: {
    settings: EngineeringOSSettings;
    saveSettings(): Promise<void>;
  };


  public display(): void {

    const { containerEl } =
      this;


    containerEl.empty();


    containerEl.createEl(
      "h2",
      {
        text:
          "Engineering OS Settings",
      },
    );


    new Setting(containerEl)
      .setName("AI Provider")
      .addDropdown(
        (dropdown) =>
          dropdown
            .addOption(
              "mock",
              "Mock",
            )
            .addOption(
              "openai",
              "OpenAI",
            )
            .addOption(
              "ollama",
              "Ollama",
            )
            .setValue(
              this.plugin.settings.aiProvider,
            )
            .onChange(
              async (value) => {

                this.plugin.settings =
                  {
                    ...this.plugin.settings,
                    aiProvider:
                      value as EngineeringOSSettings["aiProvider"],
                  };

                await this.plugin.saveSettings();

              },
            ),
      );


    new Setting(containerEl)
      .setName("AI Model")
      .addText(
        (text) =>
          text
            .setValue(
              this.plugin.settings.aiModel ?? "",
            )
            .onChange(
              async (value) => {

                this.plugin.settings =
                  {
                    ...this.plugin.settings,
                    aiModel:
                      value,
                  };

                await this.plugin.saveSettings();

              },
            ),
      );


    new Setting(containerEl)
      .setName("AI Endpoint")
      .addText(
        (text) =>
          text
            .setValue(
              this.plugin.settings.aiEndpoint ?? "",
            )
            .onChange(
              async (value) => {

                this.plugin.settings =
                  {
                    ...this.plugin.settings,
                    aiEndpoint:
                      value,
                  };

                await this.plugin.saveSettings();

              },
            ),
      );


    new Setting(containerEl)
      .setName("AI API Key")
      .addText(
        (text) =>
          text
            .setValue(
              this.plugin.settings.aiApiKey ?? "",
            )
            .onChange(
              async (value) => {

                this.plugin.settings =
                  {
                    ...this.plugin.settings,
                    aiApiKey:
                      value,
                  };

                await this.plugin.saveSettings();

              },
            ),
      );

  }

}
