import { IPlayer, NewPlayer } from './player.model';

export const sampleWithRequiredData: IPlayer = {
  id: 92110,
};

export const sampleWithPartialData: IPlayer = {
  id: 22348,
  linkedUser: 24081,
  username: '4th Architect Somalia',
  drawing: '../fake-data/blob/hipster.png',
  drawingContentType: 'unknown',
  rank: 79574,
};

export const sampleWithFullData: IPlayer = {
  id: 73714,
  linkedUser: 58002,
  linkedRoom: 40885,
  username: 'Phased',
  drawing: '../fake-data/blob/hipster.png',
  drawingContentType: 'unknown',
  totalStars: 39436,
  rank: 46370,
};

export const sampleWithNewData: NewPlayer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
