import dayjs from 'dayjs/esm';

import { IPrompt, NewPrompt } from './prompt.model';

export const sampleWithRequiredData: IPrompt = {
  id: 37443,
};

export const sampleWithPartialData: IPrompt = {
  id: 19474,
  promptContent: 'context-sensitive',
  promptDeadline: dayjs('2024-02-21T10:37'),
};

export const sampleWithFullData: IPrompt = {
  id: 40684,
  promptID: 96631,
  promptContent: 'partnerships Senegal',
  promptDeadline: dayjs('2024-02-21T05:51'),
  participantsNum: 50922,
};

export const sampleWithNewData: NewPrompt = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
