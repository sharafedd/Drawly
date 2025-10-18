import { IPlayer } from 'app/entities/player/player.model';
import { IRound } from 'app/entities/round/round.model';
import { IRoundPrompt } from 'app/entities/round-prompt/round-prompt.model';
import { RoomType } from 'app/entities/enumerations/room-type.model';

export interface IRoom {
  id: number;
  noOfRounds?: number | null;
  noOfPlayers?: number | null;
  roomType?: RoomType | null;
  roomCode?: number | null;
  theme?: string | null;
  player?: Pick<IPlayer, 'id'> | null;
  round?: Pick<IRound, 'id'> | null;
  roundPrompt?: Pick<IRoundPrompt, 'id'> | null;
}

export type NewRoom = Omit<IRoom, 'id'> & { id: null };
