import { ICompetition, NewCompetition } from './competition.model';

export const sampleWithRequiredData: ICompetition = {
  id: 91805,
};

export const sampleWithPartialData: ICompetition = {
  id: 43677,
  totalParticipants: 35858,
};

export const sampleWithFullData: ICompetition = {
  id: 57377,
  compType: true,
  totalParticipants: 437,
};

export const sampleWithNewData: NewCompetition = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
