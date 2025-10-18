import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPost, NewPost } from '../post.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPost for edit and NewPostFormGroupInput for create.
 */
type PostFormGroupInput = IPost | PartialWithRequiredKeyOf<NewPost>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPost | NewPost> = Omit<T, 'submissionDate'> & {
  submissionDate?: string | null;
};

type PostFormRawValue = FormValueOf<IPost>;

type NewPostFormRawValue = FormValueOf<NewPost>;

type PostFormDefaults = Pick<NewPost, 'id' | 'submissionDate'>;

type PostFormGroupContent = {
  id: FormControl<PostFormRawValue['id'] | NewPost['id']>;
  linkedPrompt: FormControl<PostFormRawValue['linkedPrompt']>;
  linkedUser: FormControl<PostFormRawValue['linkedUser']>;
  postContent: FormControl<PostFormRawValue['postContent']>;
  postContentContentType: FormControl<PostFormRawValue['postContentContentType']>;
  averageStar: FormControl<PostFormRawValue['averageStar']>;
  submissionDate: FormControl<PostFormRawValue['submissionDate']>;
  comment: FormControl<PostFormRawValue['comment']>;
};

export type PostFormGroup = FormGroup<PostFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PostFormService {
  createPostFormGroup(post: PostFormGroupInput = { id: null }): PostFormGroup {
    const postRawValue = this.convertPostToPostRawValue({
      ...this.getFormDefaults(),
      ...post,
    });
    return new FormGroup<PostFormGroupContent>({
      id: new FormControl(
        { value: postRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      linkedPrompt: new FormControl(postRawValue.linkedPrompt),
      linkedUser: new FormControl(postRawValue.linkedUser),
      postContent: new FormControl(postRawValue.postContent),
      postContentContentType: new FormControl(postRawValue.postContentContentType),
      averageStar: new FormControl(postRawValue.averageStar),
      submissionDate: new FormControl(postRawValue.submissionDate),
      comment: new FormControl(postRawValue.comment),
    });
  }

  getPost(form: PostFormGroup): IPost | NewPost {
    return this.convertPostRawValueToPost(form.getRawValue() as PostFormRawValue | NewPostFormRawValue);
  }

  resetForm(form: PostFormGroup, post: PostFormGroupInput): void {
    const postRawValue = this.convertPostToPostRawValue({ ...this.getFormDefaults(), ...post });
    form.reset(
      {
        ...postRawValue,
        id: { value: postRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PostFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      submissionDate: currentTime,
    };
  }

  private convertPostRawValueToPost(rawPost: PostFormRawValue | NewPostFormRawValue): IPost | NewPost {
    return {
      ...rawPost,
      submissionDate: dayjs(rawPost.submissionDate, DATE_TIME_FORMAT),
    };
  }

  private convertPostToPostRawValue(
    post: IPost | (Partial<NewPost> & PostFormDefaults)
  ): PostFormRawValue | PartialWithRequiredKeyOf<NewPostFormRawValue> {
    return {
      ...post,
      submissionDate: post.submissionDate ? post.submissionDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
