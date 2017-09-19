export class Comment {
  id: string;
  createdUser: number;
  line: string;
  createdOn: Date;
  updatedOn: Date;
  likes: Array<number>;
  comments: Array<Comment>;
}
