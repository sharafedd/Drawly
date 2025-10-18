import { RoomType } from 'app/entities/enumerations/room-type.model';

import { IRoom, NewRoom } from './room.model';

export const sampleWithRequiredData: IRoom = {
  id: 302,
};

export const sampleWithPartialData: IRoom = {
  id: 46298,
  noOfRounds: 55206,
  roomType: RoomType['Public'],
  theme: 'bandwidth-monitored Account',
};

export const sampleWithFullData: IRoom = {
  id: 91197,
  noOfRounds: 26709,
  noOfPlayers: 47058,
  roomType: RoomType['Public'],
  roomCode: 33367,
  theme: 'SAS Concrete Triple-buffered',
};

export const sampleWithNewData: NewRoom = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
