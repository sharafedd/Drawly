import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
};

export const sampleWithPartialData: IPost = {
  id: 93202,
  avergaeStar: 798,
};

export const sampleWithFullData: IPost = {
  id: 54350,
  postID: 79841,
  linkedPrompt: 60570,
  linkedUser: 92413,
  postContent: '../fake-data/blob/hipster.png',
  postContentContentType: 'unknown',
  avergaeStar: 23240,
};

export const sampleWithNewData: NewPost = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
