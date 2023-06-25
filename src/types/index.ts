export type StatusType = {
  title: string;
  color: string;
};

export type LogStatus =
  | "info"
  | "success"
  | "error"
  | "warn"
  | "critical"
  | "debug"
  | "verbose"
  | "silly"
  | "http";
