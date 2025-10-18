import { IRoundPrompt, NewRoundPrompt } from './round-prompt.model';

export const sampleWithRequiredData: IRoundPrompt = {
  id: 21467,
};

export const sampleWithPartialData: IRoundPrompt = {
  id: 11968,
};

export const sampleWithFullData: IRoundPrompt = {
  id: 24176,
  linkedRoom: 58916,
  linkedRound: 610,
  content: 'Sleek Nevada',
};

export const sampleWithNewData: NewRoundPrompt = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
