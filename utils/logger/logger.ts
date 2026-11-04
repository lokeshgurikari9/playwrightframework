import { env, type LogLevel } from '../../config/env.config';

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: Number.POSITIVE_INFINITY,
};

const CONSOLE_METHOD: Record<Exclude<LogLevel, 'silent'>, 'debug' | 'info' | 'warn' | 'error'> = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
};

/**
 * Small dependency-free structured logger. The default level is controlled by
 * LOG_LEVEL so CI can stay quiet while local debugging can be verbose.
 */
export class Logger {
  constructor(
    private readonly context: string,
    private readonly level: LogLevel = env.LOG_LEVEL,
  ) {}

  debug(message: string, meta?: unknown): void {
    this.write('debug', message, meta);
  }

  info(message: string, meta?: unknown): void {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.write('error', message, meta);
  }

  private write(level: Exclude<LogLevel, 'silent'>, message: string, meta?: unknown): void {
    if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[this.level]) return;

    const suffix = meta === undefined ? '' : ` ${this.serialize(meta)}`;
    console[CONSOLE_METHOD[level]](`[${level.toUpperCase()}] [${this.context}] ${message}${suffix}`);
  }

  private serialize(meta: unknown): string {
    if (meta instanceof Error) return meta.stack || meta.message;
    if (typeof meta === 'string') return meta;

    try {
      return JSON.stringify(meta);
    } catch {
      return String(meta);
    }
  }
}

export const logger = new Logger('api-automation');
export const createLogger = (context: string): Logger => new Logger(context);
