import { IUser } from 'app/entities/user/user.model';

export interface IPost {
  id: number;
  postID?: number | null;
  linkedPrompt?: number | null;
  linkedUser?: number | null;
  postContent?: string | null;
  postContentContentType?: string | null;
  avergaeStar?: number | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewPost = Omit<IPost, 'id'> & { id: null };
