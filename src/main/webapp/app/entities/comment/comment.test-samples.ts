import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 78899,
};

export const sampleWithPartialData: IComment = {
  id: 78272,
  linkedUser: 34202,
};

export const sampleWithFullData: IComment = {
  id: 56305,
  linkedPost: 1063,
  linkedUser: 64492,
  content: 'New Tools circuit',
  timestamp: dayjs('2024-03-05T06:52'),
};

export const sampleWithNewData: NewComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
