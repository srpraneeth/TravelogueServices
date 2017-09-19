import * as express from "express";

class IndexRoutes {
  public routes: express.Router;

  constructor() {
    this.routes = express.Router();
    this.addRoutes();
  }

  private addRoutes(): void {
    this.routes.get("/", (req, res) => {
      res.redirect("/swagger-ui.html");
    });
  }
}

export default new IndexRoutes().routes;
