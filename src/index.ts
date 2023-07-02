import fs from "fs";
import path from "path";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { EOL } from "os";
import { LogStatus, StatusType } from "./types";
import { colors, defaultStatuses } from "./misc";

let defaultStatus: Array<StatusType> = defaultStatuses;

const getColorCode = (title: string) => {
  const status = defaultStatus.find((status) => status.title === title) ?? {
    title: "info",
    color: "blue",
  };

  return colors[status.color] || "\x1B[0m";
};

const defaultLogFilePath = path.join(process.cwd(), "logs.log");
const configFilePath = path.join(process.cwd(), "f-log.json");
let logFilePath = defaultLogFilePath;
let logFormat = "plain";
let enableConsole = true;

init();

export const log = async (
  message: any,
  title: LogStatus = "info",
  persist: boolean = true
) => {
  try {
    const id = uuidv4();
    const msg =
      typeof message !== "string" || isJSON(message)
        ? JSON.stringify(message)
        : message;
    const timestamp = new Date().toISOString();
    const logMessage = `${id} ${title} ${msg} ${timestamp}${EOL}`;
    if (enableConsole) {
      console.log(
        `${getColorCode(title)}[${title.toUpperCase()}] ${moment().format(
          "HH:mm:ss"
        )}`,
        msg,
        `${colors["reset"]}`
      );
    }
    if (persist) {
      if (logFormat === "json") {
        const logEntry = {
          message,
          id,
          level: title,
          timestamp,
        };
        const logFileContent = fs.readFileSync(logFilePath, "utf8");
        const logData = isJSON(logFileContent)
          ? JSON.parse(logFileContent)
          : [];
        logData.push(logEntry);
        fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
      } else {
        await fs.promises.appendFile(logFilePath, logMessage, {
          encoding: "utf8",
        });
      }
    }
  } catch (err: any) {
    console.log(
      `${getColorCode("error")}[LOG-ERROR] ${moment().format("HH:mm:ss")}`,
      `Error writing to ${logFilePath}: ${err.message}`,
      `${colors["reset"]}`
    );
    throw new Error(`Error writing to ${logFilePath}: ${err.message}`);
  }
};

export const logAll = (
  title: LogStatus = "info",
  persist: boolean,
  ...messages: Array<any>
) => {
  messages.forEach((message) => log(message, title, persist));
};

export const getLogs = (group: boolean = true, status?: string): object => {
  const logs = fs.readFileSync(logFilePath, "utf8").trim().split(EOL);

  if (logFormat === "json") {
    const logFileContent = fs.readFileSync(logFilePath, "utf8");
    const logData = isJSON(logFileContent) ? JSON.parse(logFileContent) : [];
    if (group) {
      let groupedData;
      if (status && status.trim().length > 0) {
        groupedData = logData.reduce((result: any, entry: any) => {
          const { level, ...data } = entry;
          if (level === status) {
            if (!result[level]) {
              result[level] = [];
            }
            result[level].push(data);
          }
          return result;
        }, {});
      } else {
        groupedData = logData.reduce((result: any, entry: any) => {
          const { level, ...data } = entry;
          if (!result[level]) {
            result[level] = [];
          }
          result[level].push(data);
          return result;
        }, {});
      }
      return groupedData;
    } else {
      if (status && status.trim().length > 0) {
        const filteredData = logData.filter(
          (entry: any) => entry.level === status
        );
        return filteredData;
      }
      return logData;
    }
  }

  return loadLogsForPlainText(logs, group, status);
};

function loadLogsForPlainText(
  logs: string[],
  group: boolean,
  status: string | undefined
) {
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
}

async function init() {
  if (fs.existsSync(configFilePath)) {
    if (enableConsole) {
      console.log(
        `${getColorCode("info")}[CONFIG-FILE-LOAD] ${moment().format(
          "HH:mm:ss"
        )}`,
        "Loaded f-log.json config file",
        `${colors["reset"]}`
      );
    }
    try {
      const configData = fs.readFileSync(configFilePath, { encoding: "utf8" });
      const config = JSON.parse(configData);
      const {
        filename = "logs",
        extension = "log",
        path: folderPath,
        status,
        format,
      } = config;

      enableConsole = config["enable-console"] ?? true;

      getLogFormat(format);

      overrideTheme(status);

      getFilePath(folderPath, filename, extension);

      if (logFormat == "json") {
        if (!fs.existsSync(logFilePath)) {
          await fs.promises.appendFile(logFilePath, EOL, {
            encoding: "utf8",
          });
        }
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

function getLogFormat(format: any) {
  if (format) {
    const acceptedFormats = ["plain", "json"];
    if (acceptedFormats.includes(format)) {
      logFormat = format;
    }
  }
}

function getFilePath(folderPath: any, filename: any, extension: any) {
  const overrideExtension = logFormat === "json" ? true : false;
  if (folderPath) {
    const resolvedFolderPath = path.resolve(process.cwd(), folderPath);
    if (!fs.existsSync(resolvedFolderPath)) {
      fs.mkdirSync(resolvedFolderPath, { recursive: true });
    }
    const endsWithSlash = folderPath.endsWith("/");
    const logFileName = `${filename}.${
      overrideExtension ? logFormat : extension
    }`;
    const logFile = endsWithSlash
      ? `${folderPath}${logFileName}`
      : `${folderPath}/${logFileName}`;

    logFilePath = path.resolve(process.cwd(), logFile);
  } else {
    const logFileName = `${filename}.${
      overrideExtension ? logFormat : extension
    }`;

    logFilePath = path.resolve(process.cwd(), logFileName);
  }
}

function overrideTheme(status: any) {
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
}

function isJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}
