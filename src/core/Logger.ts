export interface Logger {
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, context?: unknown): void;
}

export class ConsoleLogger implements Logger {
  public constructor(private readonly scope: string) {}

  public debug(message: string, context?: unknown): void {
    console.debug(`[${this.scope}] ${message}`, context ?? "");
  }

  public info(message: string, context?: unknown): void {
    console.info(`[${this.scope}] ${message}`, context ?? "");
  }

  public warn(message: string, context?: unknown): void {
    console.warn(`[${this.scope}] ${message}`, context ?? "");
  }

  public error(message: string, context?: unknown): void {
    console.error(`[${this.scope}] ${message}`, context ?? "");
  }
}
