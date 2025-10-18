import dayjs from 'dayjs/esm';

export interface IComment {
  id: number;
  linkedPost?: number | null;
  linkedUser?: number | null;
  content?: string | null;
  timestamp?: dayjs.Dayjs | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
