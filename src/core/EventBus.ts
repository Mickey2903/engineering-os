export type EventHandler<T> = (payload: T) => void | Promise<void>;

export class EventBus<TEvents extends object> {
  private readonly handlers = new Map<keyof TEvents, Set<EventHandler<unknown>>>();

  public on<TKey extends keyof TEvents>(
    event: TKey,
    handler: EventHandler<TEvents[TKey]>,
  ): () => void {
    const handlers = this.handlers.get(event) ?? new Set<EventHandler<unknown>>();
    handlers.add(handler as EventHandler<unknown>);
    this.handlers.set(event, handlers);

    return () => {
      handlers.delete(handler as EventHandler<unknown>);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    };
  }

  public async emit<TKey extends keyof TEvents>(
    event: TKey,
    payload: TEvents[TKey],
  ): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    await Promise.all([...handlers].map(async (handler) => handler(payload)));
  }

  public clear(): void {
    this.handlers.clear();
  }
}
