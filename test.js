const log = require("@drantaz/f-log");

log.log("Hi", "error");
console.log(log.getLogs(true));
