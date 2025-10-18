import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRoundPrompt, NewRoundPrompt } from '../round-prompt.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRoundPrompt for edit and NewRoundPromptFormGroupInput for create.
 */
type RoundPromptFormGroupInput = IRoundPrompt | PartialWithRequiredKeyOf<NewRoundPrompt>;

type RoundPromptFormDefaults = Pick<NewRoundPrompt, 'id'>;

type RoundPromptFormGroupContent = {
  id: FormControl<IRoundPrompt['id'] | NewRoundPrompt['id']>;
  linkedRoom: FormControl<IRoundPrompt['linkedRoom']>;
  linkedRound: FormControl<IRoundPrompt['linkedRound']>;
  content: FormControl<IRoundPrompt['content']>;
};

export type RoundPromptFormGroup = FormGroup<RoundPromptFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RoundPromptFormService {
  createRoundPromptFormGroup(roundPrompt: RoundPromptFormGroupInput = { id: null }): RoundPromptFormGroup {
    const roundPromptRawValue = {
      ...this.getFormDefaults(),
      ...roundPrompt,
    };
    return new FormGroup<RoundPromptFormGroupContent>({
      id: new FormControl(
        { value: roundPromptRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      linkedRoom: new FormControl(roundPromptRawValue.linkedRoom),
      linkedRound: new FormControl(roundPromptRawValue.linkedRound),
      content: new FormControl(roundPromptRawValue.content),
    });
  }

  getRoundPrompt(form: RoundPromptFormGroup): IRoundPrompt | NewRoundPrompt {
    return form.getRawValue() as IRoundPrompt | NewRoundPrompt;
  }

  resetForm(form: RoundPromptFormGroup, roundPrompt: RoundPromptFormGroupInput): void {
    const roundPromptRawValue = { ...this.getFormDefaults(), ...roundPrompt };
    form.reset(
      {
        ...roundPromptRawValue,
        id: { value: roundPromptRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RoundPromptFormDefaults {
    return {
      id: null,
    };
  }
}
