# Welcome to F-Log!

F-Log is a versatile npm package designed to simplify file logging in your Node.js applications. With F-Log, you can effortlessly incorporate robust logging capabilities into your projects, allowing you to track and record important events, errors, and information to a file.

# Install

Install f-log using:

    npm i @drantaz/f-log

## How to use

To create a single log, use:

    import { log } from '@drantaz/f-log'

    log('Hello World, 'info');
    // This would print 'Hello World' to the console in a blue color and also log it to a
    file 'logs.log'

The third parameter is optional and only needed when you want to expressively tell `f-log` not to persist the log to the file. Example:

    log('Do not save to file','success', false);
    // This would print the text 'Do not save to file' in a green color to the console
    but won't save it to the logs.log file.

To log multiple texts at once you can use the logAll function:

    import { logAll } from  '@drantaz/f-log'

    logAll('info', true, 'Log 1', 'Log 2', 'Log 3', ...); // This will log each texts and save
    them in the logs.log file.

    logAll('info', false, 'Log 1', 'Log 2', 'Log 3', ...); // This will log each texts but won't
     save them in the logs.log file.

To read your logs, use:

    import { getLogs } from  '@drantaz/f-log'

    # Get all logs without grouping
    const logs = getLogs(false);

    # Get all logs with grouping
    const logs = getLogs();

    # Get by title without grouping
    const logs = getLogs(false, 'info');

    # Get by title with grouping
    const logs = getLogs(true, 'info');

You can load the logs anyhow you please or you could just download the logs 😉


## Configurations:

To override the configuration of `@drantaz/f-log`, create a file called `f-log.json` at the root of your project.

Override the path to where you want to save your log files. For example, I'm saving mine inside the `src` folder to a folder called `logs`.

    { 
        "path": "./src/logs"
    }

More configuration options would be coming up with newer releases of `@drantaz/f-log`


## Log types

| **status** | **color** |

| info | blue |

| success | green |

| warn | orange |

| error | red |

| critical | darkred |





![Screenshot 2023-06-19 at 12 19 54 PM](https://github.com/cheese-framework/f-log/assets/54779057/982daef1-8dd1-43e2-806d-4b7e2b96834c)
