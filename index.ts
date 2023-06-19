import fs from "fs";
import path from "path";
import moment from "moment";
import { EOL } from "os";
// import { log, getLogs, logAll } from 'f-log';

export const log = async (
  message: string | unknown,
  title: "info" | "success" | "warn" | "error" | "critical" = "info",
  persist: boolean = true
) => {
  console.log(
    `${getColorCode(title)}[${title.toUpperCase()}] ${moment(new Date()).format(
      "HH:mm:ss"
    )}`,
    message
  );
  if (persist)
    fs.appendFile(
      path.join(__dirname, "../../../logs.log"),
      `${title} ${message} ${new Date().toISOString()}${EOL}`,
      { encoding: "utf8" },
      (err) => {
        if (err) {
          log(err.message, "error");
        }
      }
    );
};

export const logAll = (
  title: "info" | "success" | "warn" | "error" | "critical" = "info",
  persist: boolean,
  ...messages: Array<string>
) => {
  messages.forEach((message) => log(message, title, persist));
};

export const getLogs = (group: boolean = true, status?: string): object => {
  const logs = fs
    .readFileSync(path.join(__dirname, "../../../logs.log"), {
      encoding: "utf8",
    })
    .trim()
    .split(EOL);
  const logObj: any = {};
  const logArr = [];

  for (let i = 0; i < logs.length; i++) {
    const [title] = logs[i].split(" ");
    const data = logs[i].split(" ").slice(1);
    const message = [...data].slice(0, data.length - 1).join(" ");
    const time = [...data][data.length - 1];

    if (group) {
      if (status && status.trim().length > 0) {
        const statuses = status.split(",");
        for (const state of statuses) {
          if (title === state) {
            logObj[title.trim()] = logObj[title.trim()]
              ? [
                  ...logObj[title.trim()],
                  { message, time, id: Math.random().toString(36) },
                ]
              : [{ message, time, id: Math.random().toString(36) }];
          } else {
            logObj[state.trim()] = logObj[state.trim()]
              ? [...logObj[state.trim()]]
              : [];
          }
        }
      } else {
        logObj[title.trim()] = logObj[title.trim()]
          ? [
              ...logObj[title.trim()],
              { message, time, id: Math.random().toString(36) },
            ]
          : [{ message, time, id: Math.random().toString(36) }];
      }
    } else {
      if (status && status.trim().length > 0) {
        const statuses = status.split(",");
        for (const state of statuses) {
          if (title === state) {
            logArr.push({
              message,
              time,
              title,
              id: Math.random().toString(36),
            });
          }
        }
      } else {
        logArr.push({ message, time, title, id: Math.random().toString(36) });
      }
    }
  }

  return logArr.sort((a: any, b: any) => {
    return Number(new Date(a.time)) - Number(new Date(b.time));
  });
};

const compare = (a: any, b: any) => {
  console.log(a, b);

  if (a.time > b.time) {
    return -1;
  }
  if (a.time < b.time) {
    return 1;
  }
  return 0;
};

const getColorCode = (title: string) => {
  if (title === "error") {
    return "\x1B[38;5;9m";
  } else if (title === "success") {
    return "\x1B[38;5;2m";
  } else if (title === "warn") {
    return "\x1B[38;5;215m";
  } else if (title === "critical") {
    return "\x1B[38;5;196m";
  }
  return "\x1B[34m";
};
