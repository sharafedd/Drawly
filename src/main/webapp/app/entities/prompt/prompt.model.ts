import dayjs from 'dayjs/esm';
import { IPost } from 'app/entities/post/post.model';

export interface IPrompt {
  id: number;
  promptID?: number | null;
  promptContent?: string | null;
  promptDeadline?: dayjs.Dayjs | null;
  participantsNum?: number | null;
  post?: Pick<IPost, 'id'> | null;
}

export type NewPrompt = Omit<IPrompt, 'id'> & { id: null };
