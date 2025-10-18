export interface IRoundPrompt {
  id: number;
  linkedRoom?: number | null;
  linkedRound?: number | null;
  content?: string | null;
}

export type NewRoundPrompt = Omit<IRoundPrompt, 'id'> & { id: null };
