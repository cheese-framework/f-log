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

    log('Hello World, 'info');

    // This would print "Hello World" to 
    // the console in a 
    // blue color and also log it to a
    // file "logs.log"
```
The third parameter is optional and only needed when you want to expressively tell `f-log` not to persist the log to the file. Example:
```ts
    log('Do not save to file','success', false);
    // This would print the text 'Do not save to file' 
    // in a green color to the console
    // but won't save it to the logs.log file.
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

    # Get all logs without grouping
    const logs = getLogs(false);

    # Get all logs with grouping
    const logs = getLogs();

    # Get by title without grouping
    const logs = getLogs(false, 'info');

    # Get by title with grouping
    const logs = getLogs(true, 'info');
```
You can load the logs anyhow you please or you could just download the logs 😉
#

## Configurations:

To override the configuration of `@drantaz/f-log`, create a file called `f-log.json` at the root of your project.

Override the _`path`_ to where you want to save your log files. For example, I'm saving mine inside the `src` folder to a folder called `logs`.
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

For example, the status `success` uses `green` as its color. You can choose to override that or add your defined status by adding more configurations to the `f-log.json` file. Here's how:

````json
{
    "status": [
        { "title": "success", "color": "cyan" },
        { "title": "debug", "color": "magenta" }
    ]
}
````
Not only did I override the predefined color for `success` from `green` to `cyan`, I also introduced a new status, `debug` with the color `magenta`. You can add as much statuses as your want or override the colors of the predefined statuses.

More configuration options would be coming up with newer releases of `@drantaz/f-log`
#

## Log types

| **status** | **color** |
| ---------- | ---------- |
| info | blue |
| success | green |
| warn | yellow |
| error | red |
| critical | brightRed |

#



![Screenshot 2023-06-19 at 12 19 54 PM](https://github.com/cheese-framework/f-log/assets/54779057/982daef1-8dd1-43e2-806d-4b7e2b96834c)
