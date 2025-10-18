import { CompetitionType } from 'app/entities/enumerations/competition-type.model';

import { ICompetition, NewCompetition } from './competition.model';

export const sampleWithRequiredData: ICompetition = {
  id: 91805,
};

export const sampleWithPartialData: ICompetition = {
  id: 35858,
  competitionType: CompetitionType['Weekly'],
};

export const sampleWithFullData: ICompetition = {
  id: 96433,
  linkedPrompt: 437,
  competitionType: CompetitionType['Daily'],
  noOfParticipants: 87206,
};

export const sampleWithNewData: NewCompetition = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
