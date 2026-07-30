export type ServiceToken<T> = symbol & { readonly __service?: T };

export class ServiceContainer {
  private readonly services = new Map<symbol, unknown>();

  public register<T>(token: ServiceToken<T>, service: T): void {
    if (this.services.has(token)) {
      throw new Error(`Service is already registered: ${String(token)}`);
    }
    this.services.set(token, service);
  }

  public resolve<T>(token: ServiceToken<T>): T {
    const service = this.services.get(token);
    if (service === undefined) {
      throw new Error(`Service is not registered: ${String(token)}`);
    }
    return service as T;
  }

  public clear(): void {
    this.services.clear();
  }
}

export const createServiceToken = <T>(description: string): ServiceToken<T> => Symbol(description);
