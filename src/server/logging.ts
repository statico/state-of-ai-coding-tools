/* eslint-disable no-console */
import { __DEV__, __TEST__ } from "./env";

/**
 * This is a dead simple somewhat pretty formatted logger.
 *
 * Extend it to handle structured logging or replace it with a more sophisticated logger.
 */

const isTTY = process.stdout.isTTY;

// Log levels in order of severity
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Get the current log level from environment or use defaults
function getLogLevel(): LogLevel {
  // Default levels: debug in development, info in production
  return __DEV__ ? LogLevel.DEBUG : LogLevel.INFO;
}

const currentLogLevel = getLogLevel();

export class Logger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public static forModule() {
    try {
      const err = new Error();
      if (!err.stack) return new Logger("unknown");
      const frames = err.stack.split("\n");
      const parent = frames[2];
      if (!parent) return new Logger("unknown");
      const match = parent.match(/src\/(.+)\.\w+:/);
      if (!match) return new Logger("unknown");
      return new Logger(match[1]);
    } catch (_e) {
      return new Logger("unknown");
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= currentLogLevel;
  }

  private format(message: string, params: any[]) {
    const values = params.slice();
    return message.replace(/%[%Oosdf]/g, (placeholder: string) => {
      const value = values.shift();
      switch (placeholder) {
        case "%%":
          return "%";
        case "%O":
          return JSON.stringify(value, null, 2);
        case "%o":
          return JSON.stringify(value);
        case "%s":
          return typeof value === "object" ? JSON.stringify(value) : String(value);
        case "%f":
          return String(value);
        case "%d":
          return String(Math.floor(Number(value)));
        default:
          return placeholder;
      }
    });
  }

  private color(value: string | number) {
    return isTTY ? `\x1b[${value}m` : "";
  }

  private timestamp() {
    return isTTY ? "" : `[${new Date().toISOString()}] `;
  }

  private reset() {
    return this.color(0);
  }

  public debug(message: string, ...params: any[]) {
    if (__TEST__ || !this.shouldLog(LogLevel.DEBUG)) return;

    const formattedMessage = this.format(message, params);
    console.debug(
      `${this.timestamp()}${this.color(34)}DEBUG ${this.reset()}(${this.name}): ${formattedMessage}`,
    );
  }

  public info(message: string, ...params: any[]) {
    if (__TEST__ || !this.shouldLog(LogLevel.INFO)) return;

    const formattedMessage = this.format(message, params);
    console.log(
      `${this.timestamp()}${this.color(32)}INFO ${this.reset()}(${this.name}): ${formattedMessage}`,
    );
  }

  public warn(message: string, ...params: any[]) {
    if (__TEST__ || !this.shouldLog(LogLevel.WARN)) return;

    const formattedMessage = this.format(message, params);
    console.log(
      `${this.timestamp()}${this.color(33)}WARN ${this.reset()}(${this.name}): ${formattedMessage}`,
    );
  }

  public error(message: string, ...params: any[]) {
    if (__TEST__ || !this.shouldLog(LogLevel.ERROR)) return;

    const formattedMessage = this.format(message, params);
    console.error(
      `${this.timestamp()}${this.color(31)}ERROR ${this.reset()}(${this.name}): ${formattedMessage}`,
    );
  }
}
