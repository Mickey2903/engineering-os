import {
  ItemView,
  WorkspaceLeaf,
} from "obsidian";


export const ENGINEERING_AI_VIEW_TYPE =
  "engineering-ai-chat";


export class EngineeringAIChatView extends ItemView {


  public constructor(
    leaf: WorkspaceLeaf,
  ) {
    super(leaf);
  }


  public getViewType(): string {

    return ENGINEERING_AI_VIEW_TYPE;

  }


  public getDisplayText(): string {

    return "Engineering AI";

  }


  public async onOpen(): Promise<void> {

    const container =
      this.contentEl;


    container.empty();


    container.createEl(
      "h2",
      {
        text:
          "Engineering AI",
      },
    );


    container.createEl(
      "p",
      {
        text:
          "AI assistant ready.",
      },
    );

  }


  public async onClose(): Promise<void> {

  }

}
