# Welcome to F-Log!

F-Log is a versatile npm package designed to simplify file logging in your Node.js applications. With F-Log, you can effortlessly incorporate robust logging capabilities into your projects, allowing you to track and record important events, errors, and information to a file.

# Install

Install f-log using:
```bash
npm i @drantaz/f-log
```    
#
## How to use

To create a single log, use:
```ts
import { log } from '@drantaz/f-log';

log('Hello World', 'info');
/* This would print "Hello World" to 
 * the console in a 
 * blue color and also log it to a
 * file "logs.log"
*/
```
The third parameter is optional and only needed when you want to expressively tell `f-log` not to persist the log to the file. Example:
```ts
log('Do not save to file','success', false);
/* This would print "Hello World" to 
 * the console in a green color
 * but won't save it to the
 * "logs.log" file
*/
```
To log multiple texts at once you can use the logAll function:
```ts
import { logAll } from  '@drantaz/f-log'

logAll('info', true, 'Log 1', 'Log 2', 'Log 3', ...); 
// This will log each texts and save
// them in the logs.log file.

logAll('info', false, 'Log 1', 'Log 2', 'Log 3', ...); 
// This will log each texts but won't
// save them in the logs.log file.
```
To read your logs, use:
```ts
import { getLogs } from  '@drantaz/f-log'

// Get all logs without grouping
const logs = getLogs(false);

// Get all logs with grouping
const logs = getLogs();

// Get by title without grouping
const logs = getLogs(false, 'info');

// Get by title with grouping
const logs = getLogs(true, 'info');
```
You can load the logs anyhow you please or you could just download the logs 😉
#

## Configurations:

To override the configuration of `@drantaz/f-log`, create a file called `f-log.json` at the root of your project.

Override the `path` to where you want to save your log files. For example, This configuration would save it inside the `src` folder to a folder called `logs`.
```json
{ 
    "path": "src/logs"
}
```
To change the filename or extension, use the following configuration:

```json
{  
    "filename": "debug-logs",
    "extension": "txt"
}
```
If you have concerns regarding potential performance impact caused by console logging, it is possible to opt for disabling console logging. The following steps outline the process to do so:
```json
{
    "enable-console": false
}
```

In addition, users have the flexibility to select the desired format for saving their logs. By default, logs are saved in plain text format. However, there are two supported formats: `plain` and `json`. To save logs in the `json` format, follow the instructions below:
```json
{
    "format": "json"
}
```
**Note**: Choosing `json` as a format will override your chosen extension if you specified any.

<br />


`@drantaz/f-log` comes with a predefined set of color themes. Here is the table:

| Color          | ANSI Escape Code |
| -------------- | ---------------- |
| black          | `\x1B[30m`       |
| red            | `\x1B[31m`       |
| green          | `\x1B[32m`       |
| yellow         | `\x1B[33m`       |
| blue           | `\x1B[34m`       |
| magenta        | `\x1B[35m`       |
| cyan           | `\x1B[36m`       |
| white          | `\x1B[37m`       |
| gray           | `\x1B[90m`       |
| brightRed      | `\x1B[91m`       |
| brightGreen    | `\x1B[92m`       |
| brightYellow   | `\x1B[93m`       |
| brightBlue     | `\x1B[94m`       |
| brightMagenta  | `\x1B[95m`       |
| brightCyan     | `\x1B[96m`       |
| brightWhite    | `\x1B[97m`       |
| reset          | `\x1B[0m`        |

For example, the status `success` uses `green` as its color. You can choose to override that in the `f-log.json` file. Here's how:

````json
{
    "status": [
        { "title": "success", "color": "cyan" },
        { "title": "debug", "color": "black" }
    ]
}
````
Not only did I override the predefined color for `success` from `green` to `cyan`, I also changed the color of status `debug` with the color `black`.

Stay tuned for upcoming releases of `@drantaz/f-log`, as they will bring forth additional configuration options to enhance your logging experience and provide even greater flexibility.

---

## Log types

| **status** | **color** | **level**
| ---------- | ---------- | -------- |
| error | red | 0
| critical | brightRed | 0
| warn | yellow | 1
| info | blue | 2
| success | green | 2
| http | blue | 3
| verbose | cyan | 4
| debug | brightMagenta | 5
| silly | gray | 6


#



![Screenshot 2023-06-19 at 12 19 54 PM](https://github.com/cheese-framework/f-log/assets/54779057/982daef1-8dd1-43e2-806d-4b7e2b96834c)
