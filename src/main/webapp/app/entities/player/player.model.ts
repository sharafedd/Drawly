export interface IPlayer {
  id: number;
  linkedUser?: number | null;
  linkedRoom?: number | null;
  username?: string | null;
  drawing?: string | null;
  drawingContentType?: string | null;
  totalStars?: number | null;
  rank?: number | null;
}

export type NewPlayer = Omit<IPlayer, 'id'> & { id: null };
