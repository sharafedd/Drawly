import { IRoundPrompt } from 'app/entities/round-prompt/round-prompt.model';

export interface IRound {
  id: number;
  linkedPrompt?: number | null;
  linkedRoom?: number | null;
  roundNumber?: number | null;
  roundPrompt?: Pick<IRoundPrompt, 'id'> | null;
}

export type NewRound = Omit<IRound, 'id'> & { id: null };
