import { StatusType } from "../types";

export const colors: { [key: string]: string } = {
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  gray: "\x1B[90m",
  brightRed: "\x1B[91m",
  brightGreen: "\x1B[92m",
  brightYellow: "\x1B[93m",
  brightBlue: "\x1B[94m",
  brightMagenta: "\x1B[95m",
  brightCyan: "\x1B[96m",
  brightWhite: "\x1B[97m",
  reset: "\x1B[0m",
};

export const levels = {
  error: 0,
  critical: 0,
  warn: 1,
  info: 2,
  success: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

export const defaultStatuses: Array<StatusType> = [
  { title: "info", color: "blue" },
  { title: "success", color: "green" },
  { title: "warn", color: "yellow" },
  { title: "critical", color: "brightRed" },
  { title: "error", color: "red" },
  { title: "http", color: "blue" },
  { title: "verbose", color: "cyan" },
  { title: "debug", color: "brightMagenta" },
  { title: "silly", color: "gray" },
];
