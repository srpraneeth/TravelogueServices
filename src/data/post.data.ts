import * as mongoose from "mongoose";

import { Post } from "../models/post";

const PostSchema: mongoose.Schema = new mongoose.Schema({
  head: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  },
  createdUser: {
    type: Number,
    required: true
  },
  usersTagged: {
    type: Array,
    required: false
  },
  placesTagged: {
    type: Array,
    required: false
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    required: true,
    default: Date.now
  },
  tags: {
    type: Array,
    required: false
  },
  resources: {
    type: Array,
    required: false
  },
  comments: {
    type: Array,
    required: false
  }
});

export const PostModel = mongoose.connection.model<Post>("Post", PostSchema);
