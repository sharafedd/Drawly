import { IPrompt } from 'app/entities/prompt/prompt.model';

export interface ICompetition {
  id: number;
  compType?: boolean | null;
  totalParticipants?: number | null;
  prompt?: Pick<IPrompt, 'id'> | null;
}

export type NewCompetition = Omit<ICompetition, 'id'> & { id: null };
