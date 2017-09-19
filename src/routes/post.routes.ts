import { Response, Request, Router, NextFunction } from "express";
import { WriteError, ObjectId } from "mongodb";

import { Post } from "../models/post";
import { FieldError } from "../models/error";
import { PostModel } from "../data/post.data";
import { PageOptions, SortOrder } from "../models/common";

class PostRoutes {
  public routes: Router;

  constructor() {
    this.routes = Router();
    this.addRoutes();
  }

  private addRoutes(): void {
    this.routes.post("/", this.createPost);
    this.routes.put("/", this.updatePost);
    this.routes.get("/", this.getPosts);

    this.routes.get("/:id", this.getPostById);
  }

  private updatePost(req: Request, resp: Response, next: NextFunction) {
    const post: Post = req.body;
    if (post.createdUser != req.user.id) {
      return resp.status(403).send();
    }
    req.assert("_id", "_id Cannot be Empty").notEmpty();
    req.assert("head", "Title Cannot be Empty").notEmpty();
    req.getValidationResult().then(res => {
      if (!res.isEmpty()) {
        let errors: FieldError[] = new Array();
        res
          .array()
          .forEach(err => errors.push(new FieldError(err.param, err.msg)));
        return resp.status(400).json(errors);
      }
      if (!ObjectId.isValid(req.body._id)) {
        return resp.status(400).json(new FieldError("_id", "Invalid Post Id"));
      }
      const post: Post = req.body;
      PostModel.update(post, (err: WriteError, post: Post) => {
        if (err) return next(err);
        resp.status(204).send();
      });
    });
  }

  private createPost(req: Request, resp: Response, next: NextFunction) {
    req.assert("head", "Title Cannot be Empty").notEmpty();
    req.getValidationResult().then(res => {
      if (!res.isEmpty()) {
        let errors: FieldError[] = new Array();
        res
          .array()
          .forEach(err => errors.push(new FieldError(err.param, err.msg)));
        return resp.status(400).json(errors);
      }
      const post: Post = req.body;
      post.createdUser = req.user.id;
      PostModel.create(post, (err: WriteError, post: Post) => {
        if (err) return next(err);
        resp.status(201).set("Location", post._id).send();
      });
    });
  }

  private getPosts(req: Request, resp: Response, next: NextFunction) {
    let pageOptions: PageOptions =
      req.header("page") != null ? JSON.parse(req.header("page")) : {};
    let sort: string =
      pageOptions.sort != null ? pageOptions.sort : "createdOn";
    let sortOptions = {};
    sortOptions[sort] =
      pageOptions.order != null ? pageOptions.order : SortOrder.desc;
    sortOptions;
    let pageSize: number = pageOptions.size != null ? pageOptions.size : 5;
    PostModel.find({ createdUser: req.user.id })
      .sort(sortOptions)
      .skip(
        pageSize *
          ((pageOptions.no != null || pageOptions.no < 0 ? pageOptions.no : 1) -
            1)
      )
      .limit(pageSize)
      .then(posts => {
        resp.status(200).json(posts);
      })
      .catch(err => next(err));
  }

  private getPostById(req: Request, resp: Response, next: NextFunction) {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) return resp.status(404).send();
    PostModel.findOne({ _id: id })
      .then((post: Post) => {
        if (post != null) resp.status(200).json(post);
        else resp.status(404).send();
      })
      .catch(err => next(err));
  }
}

export default new PostRoutes().routes;
