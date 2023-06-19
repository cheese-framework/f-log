"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = exports.logAll = exports.log = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const os_1 = require("os");
// import { log, getLogs, logAll } from 'f-log';
const log = (message, title = "info", persist = true) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${getColorCode(title)}[${title.toUpperCase()}] ${(0, moment_1.default)(new Date()).format("HH:mm:ss")}`, message);
    if (persist)
        fs_1.default.appendFile(path_1.default.join(__dirname, "../../../logs.log"), `${title} ${message} ${new Date().toISOString()}${os_1.EOL}`, { encoding: "utf8" }, (err) => {
            if (err) {
                (0, exports.log)(err.message, "error");
            }
        });
});
exports.log = log;
const logAll = (title = "info", persist, ...messages) => {
    messages.forEach((message) => (0, exports.log)(message, title, persist));
};
exports.logAll = logAll;
const getLogs = (group = true, status) => {
    const logs = fs_1.default
        .readFileSync(path_1.default.join(__dirname, "../../../logs.log"), {
        encoding: "utf8",
    })
        .trim()
        .split(os_1.EOL);
    const logObj = {};
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
                    }
                    else {
                        logObj[state.trim()] = logObj[state.trim()]
                            ? [...logObj[state.trim()]]
                            : [];
                    }
                }
            }
            else {
                logObj[title.trim()] = logObj[title.trim()]
                    ? [
                        ...logObj[title.trim()],
                        { message, time, id: Math.random().toString(36) },
                    ]
                    : [{ message, time, id: Math.random().toString(36) }];
            }
        }
        else {
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
            }
            else {
                logArr.push({ message, time, title, id: Math.random().toString(36) });
            }
        }
    }
    return logArr.sort((a, b) => {
        return Number(new Date(a.time)) - Number(new Date(b.time));
    });
};
exports.getLogs = getLogs;
const compare = (a, b) => {
    console.log(a, b);
    if (a.time > b.time) {
        return -1;
    }
    if (a.time < b.time) {
        return 1;
    }
    return 0;
};
const getColorCode = (title) => {
    if (title === "error") {
        return "\x1B[38;5;9m";
    }
    else if (title === "success") {
        return "\x1B[38;5;2m";
    }
    else if (title === "warn") {
        return "\x1B[38;5;215m";
    }
    else if (title === "critical") {
        return "\x1B[38;5;196m";
    }
    return "\x1B[34m";
};
