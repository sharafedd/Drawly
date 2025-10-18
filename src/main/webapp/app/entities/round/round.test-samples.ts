import { IRound, NewRound } from './round.model';

export const sampleWithRequiredData: IRound = {
  id: 64257,
};

export const sampleWithPartialData: IRound = {
  id: 28218,
  linkedRoom: 72060,
};

export const sampleWithFullData: IRound = {
  id: 87313,
  linkedPrompt: 17041,
  linkedRoom: 17061,
  roundNumber: 47143,
};

export const sampleWithNewData: NewRound = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
