import fs from "fs";
import path from "path";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { EOL } from "os";
import { StatusType } from "./types";

const colors: { [key: string]: string } = {
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

const getColorCode = (title: string) => {
  const status = defaultStatus.find((status) => status.title === title) ?? {
    title: "info",
    color: "blue",
  };

  return colors[status.color] || "\x1B[0m";
};

const defaultLogFilePath = path.join(process.cwd(), "logs.log");
const configFilePath = path.join(process.cwd(), "f-log.json");
let defaultStatus: Array<StatusType> = [
  { title: "info", color: "blue" },
  { title: "success", color: "green" },
  { title: "warn", color: "yellow" },
  { title: "critical", color: "brightRed" },
  { title: "error", color: "red" },
];
let logFilePath = defaultLogFilePath;

init();

export const log = async (
  message: any,
  title: "info" | "success" | "error" | "warn" | "critical" | string = "info",
  persist: boolean = true
) => {
  try {
    const id = uuidv4();
    const msg =
      typeof message !== "string" || !isJSON(message)
        ? JSON.stringify(message)
        : message;
    const logMessage = `${id} ${title} ${msg} ${new Date().toISOString()}${EOL}`;
    console.log(
      `${getColorCode(title)}[${title.toUpperCase()}] ${moment().format(
        "HH:mm:ss"
      )}`,
      msg,
      `${colors["reset"]}`
    );
    if (persist) {
      await fs.promises.appendFile(logFilePath, logMessage, {
        encoding: "utf8",
      });
    }
  } catch (err: any) {
    console.log(
      `${getColorCode("error")}[LOG-ERROR] ${moment().format("HH:mm:ss")}`,
      `Error writing to log.json config file: ${err.message}`,
      `${colors["reset"]}`
    );
    throw new Error(`Error writing to ${logFilePath}: ${err.message}`);
  }
};

export const logAll = (
  title: "info" | "success" | "warn" | "error" | "critical" | string = "info",
  persist: boolean,
  ...messages: Array<any>
) => {
  messages.forEach((message) => log(message, title, persist));
};

export const getLogs = (group: boolean = true, status?: string): object => {
  const logs = fs.readFileSync(logFilePath, "utf8").trim().split(EOL);

  const logObj: {
    [key: string]: { message: string; time: string; id: string }[];
  } = {};
  const logArr: { message: string; time: string; title: string; id: string }[] =
    [];

  if (logs.length && logs[0].trim().length) {
    for (const log of logs) {
      const [id, title, ...data] = log.split(" ");
      let message = data.slice(0, -1).join(" ");
      message = isJSON(message) ? JSON.parse(message) : message;
      const time = data[data.length - 1];

      if (group) {
        if (status && status.trim().length > 0) {
          const statuses = status.split(",");
          if (statuses.includes(title)) {
            logObj[title.trim()] = logObj[title.trim()]
              ? [...logObj[title.trim()], { message, time, id }]
              : [{ message, time, id }];
          } else {
            for (const state of statuses) {
              logObj[state.trim()] = logObj[state.trim()]
                ? [...logObj[state.trim()]]
                : [];
            }
          }
        } else {
          logObj[title.trim()] = logObj[title.trim()]
            ? [...logObj[title.trim()], { message, time, id }]
            : [{ message, time, id }];
        }
      } else {
        if (status && status.trim().length > 0) {
          const statuses = status.split(",");
          if (statuses.includes(title)) {
            logArr.push({ message, time, title, id });
          }
        } else {
          logArr.push({ message, time, title, id });
        }
      }
    }
  }

  const sortedLogs = logArr.sort((a, b) => {
    return Number(new Date(a.time)) - Number(new Date(b.time));
  });

  return group ? logObj : sortedLogs;
};

function init() {
  if (fs.existsSync(configFilePath)) {
    console.log(
      `${getColorCode("info")}[CONFIG-FILE-LOAD] ${moment().format(
        "HH:mm:ss"
      )}`,
      "Loaded f-log.json config file",
      `${colors["reset"]}`
    );
    try {
      const configData = fs.readFileSync(configFilePath, { encoding: "utf8" });
      const config = JSON.parse(configData);
      const {
        filename = "logs",
        extension = "log",
        path: folderPath,
        status,
      } = config;

      if (status) {
        const _status = status as Array<StatusType>;
        for (let index = 0; index < _status.length; index++) {
          const element = _status[index];
          let found = false;
          for (let index = 0; index < defaultStatus.length; index++) {
            const item = defaultStatus[index];
            if (element.title === item.title) {
              found = true;
              defaultStatus[index].color = element.color;
            }
          }
          if (!found) {
            defaultStatus.push(element);
          }
        }
      }

      if (folderPath) {
        const resolvedFolderPath = path.resolve(process.cwd(), folderPath);
        if (!fs.existsSync(resolvedFolderPath)) {
          fs.mkdirSync(resolvedFolderPath, { recursive: true });
        }

        const endsWithSlash = folderPath.endsWith("/");
        const logFileName = `${filename}.${extension}`;
        const logFile = endsWithSlash
          ? `${folderPath}${logFileName}`
          : `${folderPath}/${logFileName}`;

        logFilePath = path.resolve(process.cwd(), logFile);
      }
    } catch (err: any) {
      console.log(
        `${getColorCode("error")}[CONFIG-FILE-PARSE-ERROR] ${moment().format(
          "HH:mm:ss"
        )}`,
        `Error reading f-log.json config file: ${err.message}`,
        `${colors["reset"]}`
      );
      throw new Error(`Error reading f-log.json config file: ${err.message}`);
    }
  }
}

function isJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}
