import * as winston from "winston";

let logger = new winston.Logger({
  exitOnError: false,
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" })
  ]
});

class WinstonStream {
  write(text: string) {
    logger.info(text);
  }
}
export let winstonStream = new WinstonStream();
export default logger;
