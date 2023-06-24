import fs from "fs";
import path from "path";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { EOL } from "os";

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

const defaultLogFilePath = path.join(process.cwd(), "logs.log");
const configFilePath = path.join(process.cwd(), "f-log.json");
let logFilePath = defaultLogFilePath;

if (fs.existsSync(configFilePath)) {
  console.log(
    `${getColorCode("info")}[CONFIG-FILE_LOAD] ${moment(new Date()).format(
      "HH:mm:ss"
    )}`,
    `Loading f-log.json config file`
  );
  try {
    const configData = fs.readFileSync(configFilePath, { encoding: "utf8" });
    console.log(
      `${getColorCode("info")}[CONFIG-FILE_PARSE] ${moment(new Date()).format(
        "HH:mm:ss"
      )}`,
      `Parsing f-log.json config file`
    );
    const config = JSON.parse(configData);
    console.log(
      `${getColorCode("info")}[CONFIG-FILE_PARSE] ${moment(new Date()).format(
        "HH:mm:ss"
      )}`,
      `Config file f-log.json config file parsed successfully`
    );
    if (config.path) {
      const folderPath = path.resolve(process.cwd(), `${config.path}`);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const endsWithSlash = `${config.path}`.endsWith("/");
      const logFile = endsWithSlash
        ? `${config.path}${"logs.log"}`
        : `${config.path}/${"logs.log"}`;

      logFilePath = path.resolve(process.cwd(), `${logFile}`);
    }
  } catch (err: any) {
    console.log(
      `${getColorCode("error")}[CONFIG-FILE_PARSE_ERROR] ${moment(
        new Date()
      ).format("HH:mm:ss")}`,
      `Error reading log.json config file: ${err.message}`
    );
    throw new Error(`Error reading log.json config file: ${err.message}`);
  }
}

export const log = async (
  message: string,
  title: "info" | "success" | "warn" | "error" | "critical" = "info",
  persist: boolean = true
) => {
  try {
    const id = uuidv4();
    console.log(
      `${getColorCode(title)}[${title.toUpperCase()}] ${moment(
        new Date()
      ).format("HH:mm:ss")}`,
      message
    );
    if (persist)
      fs.appendFile(
        logFilePath,
        `${id} ${title} ${message} ${new Date().toISOString()}${EOL}`,
        { encoding: "utf8" },
        (err) => {
          if (err) {
            log(err.message, "error");
          }
        }
      );
  } catch (err: any) {
    console.log(
      `${getColorCode("error")}[CONFIG-FILE_PARSE_ERROR] ${moment(
        new Date()
      ).format("HH:mm:ss")}`,
      `Error writing to log.json config file: ${err.message}`
    );
    throw new Error(`Error writing to log.json config file: ${err.message}`);
  }
};

export const logAll = (
  title: "info" | "success" | "warn" | "error" | "critical" = "info",
  persist: boolean,
  ...messages: Array<string>
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

  for (const log of logs) {
    const [id, title, ...data] = log.split(" ");
    const message = data.slice(0, -1).join(" ");
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

  const sortedLogs = logArr.sort((a, b) => {
    return Number(new Date(a.time)) - Number(new Date(b.time));
  });

  return group ? logObj : sortedLogs;
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
