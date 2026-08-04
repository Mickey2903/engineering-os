import type { Plugin } from "obsidian";


export interface AIStorageData {

  selectedModel?: string;

  activeConversationId?: string;

  conversations:
    AIConversation[];

}


export interface AIConversation {

  id:
    string;

  title:
    string;

  created:
    number;

  messages:
    AIMessage[];

}


export interface AIMessage {

  role:
    "user" | "assistant";

  content:
    string;

  contextObjects?: string[];

}


export class AIStorageService {


  private readonly key =
    "engineering-os-ai";


  public constructor(
    private readonly plugin: Plugin,
  ) {}


  private async load():
    Promise<AIStorageData> {

    const data =
      await this.plugin.loadData();


    return {
  selectedModel:
    data?.[this.key]?.selectedModel,

  activeConversationId:
    data?.[this.key]?.activeConversationId,

  conversations:
    data?.[this.key]?.conversations
    ?? [],
};

  }



  private async save(
    data: AIStorageData,
  ): Promise<void> {

    const current =
      await this.plugin.loadData();


    await this.plugin.saveData(
      {
        ...current,

        [this.key]:
          data,
      },
    );

  }



  public async getSelectedModel():
    Promise<string | undefined> {

    const data =
      await this.load();


    return data.selectedModel;

  }



  public async setSelectedModel(
    model: string,
  ): Promise<void> {

    const data =
      await this.load();


    await this.save(
      {
        ...data,

        selectedModel:
          model,
      },
    );

  }

public async getActiveConversationId():
  Promise<string | undefined> {

  const data =
    await this.load();


  return data.activeConversationId;

}



public async setActiveConversationId(
  id: string,
): Promise<void> {

  const data =
    await this.load();


  await this.save(
    {
      ...data,

      activeConversationId:
        id,
    },
  );

}

  public async getConversations():
    Promise<AIConversation[]> {

    const data =
      await this.load();


    return data.conversations;

  }
public async saveConversation(
  conversation: AIConversation,
): Promise<void> {

  const data =
    await this.load();


  const existing =
    data.conversations.filter(
      (item) =>
        item.id !== conversation.id,
    );


  await this.save(
    {
      ...data,

      conversations: [
        ...existing,

        conversation,
      ],
    },
  );

}
public async deleteEmptyConversations(): Promise<void> {

  const data =
    await this.load();


  await this.save(
    {
      ...data,

      conversations:
        data.conversations.filter(
          (conversation) =>
            conversation.messages.length > 0,
        ),
    },
  );

}
public async deleteConversation(
  id: string,
): Promise<void> {

  const data =
    await this.load();


  await this.save(
    {
      ...data,

      conversations:
        data.conversations.filter(
          (conversation) =>
            conversation.id !== id,
        ),

    },
  );

}
public async updateConversationTitle(
  id: string,
  title: string,
): Promise<void> {

  const data =
    await this.load();


  const conversation =
    data.conversations.find(
      (item) =>
        item.id === id,
    );


  if (!conversation) {
    return;
  }


  conversation.title =
    title;


  await this.save(
    data,
  );

}
public async createConversation(
  title: string,
): Promise<AIConversation> {

  const conversation: AIConversation =
    {
      id:
        crypto.randomUUID(),

      title,

      created:
        Date.now(),

      messages: [],

    };


  await this.saveConversation(
    conversation,
  );


  return conversation;

}

}
