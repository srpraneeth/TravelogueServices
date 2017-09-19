export class Resource {
  id: string;
  type: string;
  createdOn: Date;
  updatedOn: Date;
  likes: Array<number>;
  comments: Array<Comment>;
}
