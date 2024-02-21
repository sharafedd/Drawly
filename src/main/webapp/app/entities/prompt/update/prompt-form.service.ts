import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPrompt, NewPrompt } from '../prompt.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPrompt for edit and NewPromptFormGroupInput for create.
 */
type PromptFormGroupInput = IPrompt | PartialWithRequiredKeyOf<NewPrompt>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPrompt | NewPrompt> = Omit<T, 'promptDeadline'> & {
  promptDeadline?: string | null;
};

type PromptFormRawValue = FormValueOf<IPrompt>;

type NewPromptFormRawValue = FormValueOf<NewPrompt>;

type PromptFormDefaults = Pick<NewPrompt, 'id' | 'promptDeadline'>;

type PromptFormGroupContent = {
  id: FormControl<PromptFormRawValue['id'] | NewPrompt['id']>;
  promptID: FormControl<PromptFormRawValue['promptID']>;
  promptContent: FormControl<PromptFormRawValue['promptContent']>;
  promptDeadline: FormControl<PromptFormRawValue['promptDeadline']>;
  participantsNum: FormControl<PromptFormRawValue['participantsNum']>;
  post: FormControl<PromptFormRawValue['post']>;
};

export type PromptFormGroup = FormGroup<PromptFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PromptFormService {
  createPromptFormGroup(prompt: PromptFormGroupInput = { id: null }): PromptFormGroup {
    const promptRawValue = this.convertPromptToPromptRawValue({
      ...this.getFormDefaults(),
      ...prompt,
    });
    return new FormGroup<PromptFormGroupContent>({
      id: new FormControl(
        { value: promptRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      promptID: new FormControl(promptRawValue.promptID),
      promptContent: new FormControl(promptRawValue.promptContent),
      promptDeadline: new FormControl(promptRawValue.promptDeadline),
      participantsNum: new FormControl(promptRawValue.participantsNum),
      post: new FormControl(promptRawValue.post),
    });
  }

  getPrompt(form: PromptFormGroup): IPrompt | NewPrompt {
    return this.convertPromptRawValueToPrompt(form.getRawValue() as PromptFormRawValue | NewPromptFormRawValue);
  }

  resetForm(form: PromptFormGroup, prompt: PromptFormGroupInput): void {
    const promptRawValue = this.convertPromptToPromptRawValue({ ...this.getFormDefaults(), ...prompt });
    form.reset(
      {
        ...promptRawValue,
        id: { value: promptRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PromptFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      promptDeadline: currentTime,
    };
  }

  private convertPromptRawValueToPrompt(rawPrompt: PromptFormRawValue | NewPromptFormRawValue): IPrompt | NewPrompt {
    return {
      ...rawPrompt,
      promptDeadline: dayjs(rawPrompt.promptDeadline, DATE_TIME_FORMAT),
    };
  }

  private convertPromptToPromptRawValue(
    prompt: IPrompt | (Partial<NewPrompt> & PromptFormDefaults)
  ): PromptFormRawValue | PartialWithRequiredKeyOf<NewPromptFormRawValue> {
    return {
      ...prompt,
      promptDeadline: prompt.promptDeadline ? prompt.promptDeadline.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
