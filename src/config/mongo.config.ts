import * as mongoose from "mongoose";
import { Mockgoose } from "mockgoose";

import config from "./config";

export class MongoConfig {
  async config(): Promise<void> {
    (<any>mongoose).Promise = global.Promise;
    if (config.APP_PROFILE == "test") {
      let mockgoose: Mockgoose = new Mockgoose(mongoose);
      await mockgoose.prepareStorage().then(() => {
        return this.connect();
      });
    } else {
      return this.connect();
    }
  }

  private connect(): Promise<void> {
    return new Promise<void>(function(resolve, reject) {
      mongoose.connect(
        config.MONGODB_CONNECTION,
        {
          useMongoClient: true
        },
        function(err) {
          if (err) {
            reject(err);
            return;
          } else {
            resolve();
            return;
          }
        }
      );
      mongoose.set("debug", true);
    });
  }
}

export default new MongoConfig().config();
