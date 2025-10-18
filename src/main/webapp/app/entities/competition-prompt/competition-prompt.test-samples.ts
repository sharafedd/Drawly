import { ICompetitionPrompt, NewCompetitionPrompt } from './competition-prompt.model';

export const sampleWithRequiredData: ICompetitionPrompt = {
  id: 41182,
};

export const sampleWithPartialData: ICompetitionPrompt = {
  id: 23460,
  linkedCompetition: 39922,
  promptContent: 'Designer Multi-channelled compress',
};

export const sampleWithFullData: ICompetitionPrompt = {
  id: 29995,
  linkedCompetition: 25986,
  promptContent: 'technologies Metal improvement',
};

export const sampleWithNewData: NewCompetitionPrompt = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
