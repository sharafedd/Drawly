import { IPost } from 'app/entities/post/post.model';

export interface ICompetitionPrompt {
  id: number;
  linkedCompetition?: number | null;
  promptContent?: string | null;
  post?: Pick<IPost, 'id'> | null;
}

export type NewCompetitionPrompt = Omit<ICompetitionPrompt, 'id'> & { id: null };
