import dayjs from 'dayjs/esm';

import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
};

export const sampleWithPartialData: IPost = {
  id: 93202,
  submissionDate: dayjs('2024-02-21T12:37'),
};

export const sampleWithFullData: IPost = {
  id: 54350,
  linkedPrompt: 79841,
  linkedUser: 60570,
  postContent: '../fake-data/blob/hipster.png',
  postContentContentType: 'unknown',
  averageStar: 92413,
  submissionDate: dayjs('2024-02-21T07:13'),
};

export const sampleWithNewData: NewPost = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
