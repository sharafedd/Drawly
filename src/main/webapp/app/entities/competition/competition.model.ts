import { ICompetitionPrompt } from 'app/entities/competition-prompt/competition-prompt.model';
import { CompetitionType } from 'app/entities/enumerations/competition-type.model';

export interface ICompetition {
  id: number;
  linkedPrompt?: number | null;
  competitionType?: CompetitionType | null;
  noOfParticipants?: number | null;
  competitionPrompt?: Pick<ICompetitionPrompt, 'id'> | null;
}

export type NewCompetition = Omit<ICompetition, 'id'> & { id: null };
