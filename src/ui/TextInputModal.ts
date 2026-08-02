import { App, Modal, Setting } from "obsidian";


export class TextInputModal extends Modal {

  private value = "";

  private resolve:
    ((value: string | undefined) => void) | undefined;


  public constructor(
    app: App,
    private readonly title: string,
  ) {
    super(app);
  }


  public openAndGetValue():
    Promise<string | undefined> {

    return new Promise(
      (resolve) => {

        this.resolve =
          resolve;

        this.open();

      },
    );

  }


  public onOpen(): void {

    const { contentEl } =
      this;


    contentEl.empty();


    contentEl.createEl(
      "h2",
      {
        text:
          this.title,
      },
    );


    new Setting(contentEl)
      .setName(
        "Value",
      )
      .addText(
        (text) => {

          text.onChange(
            (value) => {

              this.value =
                value;

            },
          );


          text.inputEl.focus();

        },
      );


    new Setting(contentEl)
      .addButton(
        (button) => {

          button
            .setButtonText(
              "OK",
            )
            .setCta()
            .onClick(
              () => {

                this.resolve?.(
                  this.value,
                );

                this.close();

              },
            );

        },
      );

  }


  public onClose(): void {

    this.resolve?.(
      undefined,
    );

  }

}
