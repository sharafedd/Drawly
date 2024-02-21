import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type PostFormDefaults = Pick<NewPost, 'id'>;

type PostFormGroupContent = {
  id: FormControl<IPost['id'] | NewPost['id']>;
  postID: FormControl<IPost['postID']>;
  linkedPrompt: FormControl<IPost['linkedPrompt']>;
  linkedUser: FormControl<IPost['linkedUser']>;
  postContent: FormControl<IPost['postContent']>;
  postContentContentType: FormControl<IPost['postContentContentType']>;
  avergaeStar: FormControl<IPost['avergaeStar']>;
  user: FormControl<IPost['user']>;
};

export type PostFormGroup = FormGroup<PostFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PostFormService {
  createPostFormGroup(post: PostFormGroupInput = { id: null }): PostFormGroup {
    const postRawValue = {
      ...this.getFormDefaults(),
      ...post,
    };
    return new FormGroup<PostFormGroupContent>({
      id: new FormControl(
        { value: postRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      postID: new FormControl(postRawValue.postID),
      linkedPrompt: new FormControl(postRawValue.linkedPrompt),
      linkedUser: new FormControl(postRawValue.linkedUser),
      postContent: new FormControl(postRawValue.postContent),
      postContentContentType: new FormControl(postRawValue.postContentContentType),
      avergaeStar: new FormControl(postRawValue.avergaeStar),
      user: new FormControl(postRawValue.user),
    });
  }

  getPost(form: PostFormGroup): IPost | NewPost {
    return form.getRawValue() as IPost | NewPost;
  }

  resetForm(form: PostFormGroup, post: PostFormGroupInput): void {
    const postRawValue = { ...this.getFormDefaults(), ...post };
    form.reset(
      {
        ...postRawValue,
        id: { value: postRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PostFormDefaults {
    return {
      id: null,
    };
  }
}
