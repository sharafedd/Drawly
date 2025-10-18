import dayjs from 'dayjs/esm';
import { IComment } from 'app/entities/comment/comment.model';

export interface IPost {
  id: number;
  linkedPrompt?: number | null;
  linkedUser?: number | null;
  postContent?: string | null;
  postContentContentType?: string | null;
  averageStar?: number | null;
  submissionDate?: dayjs.Dayjs | null;
  comment?: Pick<IComment, 'id'> | null;
}

export type NewPost = Omit<IPost, 'id'> & { id: null };
