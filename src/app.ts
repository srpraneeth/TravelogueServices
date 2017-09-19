import * as path from "path";
import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as swaggerUi from "swagger-ui-express";
import * as jwt from "jsonwebtoken";
import * as expressValidator from "express-validator";

import { winstonStream } from "./config/log.config";
import logger from "./config/log.config";
import jwtSecurity from "./config/jwtsecurity.config";
import MongoConfig from "./config/mongo.config";

import indexRoutes from "./routes/index.routes";
import postRoutes from "./routes/post.routes";

import { PageOptions } from "./models/common";
import { Error } from "./models/error";

// import * as swaggerDocument from "./docs/swagger.json";
const swaggerDocument = require("./docs/swagger.json");

// Creates and configures an ExpressJS web server.
class App {
  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    MongoConfig.then(() => {
      logger.info("Mongo connection successful");
      this.initializeMiddleware();
      this.initializeRoutes();
      this.globalErrorHandlerMiddleware();
      (this.express as any).emit("mongoInitialized");
    }).catch((err: Error) => {
      logger.error("Could not connect to mongo instance.");
      process.exit(1);
    });
  }

  // Configure Express middleware.
  private initializeMiddleware(): void {
    this.express.use(morgan("tiny", { stream: winstonStream }));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    logger.info("Morgan, BodyParser Middlewares Configured Successfully");
    this.docsMiddleware();
    this.express.use(jwtSecurity);
    this.express.use(expressValidator());
    this.express.disable("x-powered-by");
  }

  private docsMiddleware(): void {
    this.express.use(
      "/swagger-ui.html",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.express.use("/api-docs", (req, resp) => resp.send(swaggerDocument));
    this.express.use("/", indexRoutes);
    logger.info("Docs Routes Configured Successfully");
  }

  // Global Error Handler
  private globalErrorHandlerMiddleware(): void {
    this.express.use(function(err, req, resp, next) {
      logger.error(
        `{ reqBody: ${JSON.stringify(
          req.body
        )}, reqUrl: ${req.originalUrl}, reqMeth: ${req.method}, error: ${err} }`
      );
      resp.status(500);
      resp.send(new Error("Internal Server Error Occured"));
    });
  }

  // Configure API endpoints.
  private initializeRoutes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    this.express.use("/post", postRoutes);
    logger.info("App Routes Configured Successfully");
  }
}

export default new App().express;
