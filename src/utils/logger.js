import {createLogger, format, transports, addColors} from "winston";

const {combine} = format;
const myCustomLevels = {
    levels: {
        info: 6,
        error: 3
    },
    mycolors: {
        info: 'blue',
        error: 'red'
    }
  };
  
export const logger = createLogger({
    levels: myCustomLevels.levels,
    format: combine(
        format.colorize(),
        format.simple()
    ),
});
addColors(myCustomLevels.mycolors);
logger.add(new transports.Console());
