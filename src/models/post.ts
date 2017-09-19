import * as mongoose from "mongoose";

import { Tag } from "./tag";
import { Resource } from "./resource";
import { Comment } from "./comment";

import { NotEmpty, IsNumeric, IsDate } from "validator.ts/decorator/Validation";

export class IPost {
  @NotEmpty() head: string;
  content: string;
  @NotEmpty()
  @IsNumeric()
  createdUser: number;
  usersTagged: Array<number>;
  placesTagged: Array<string>;
  @IsDate() createdOn: Date;
  @IsDate() updatedOn: Date;
  tags: Array<Tag>;
  resources: Array<Resource>;
  comments: Array<Comment>;
}

export interface Post extends IPost, mongoose.Document {}
