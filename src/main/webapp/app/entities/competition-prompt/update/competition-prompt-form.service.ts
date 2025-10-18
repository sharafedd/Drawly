import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompetitionPrompt, NewCompetitionPrompt } from '../competition-prompt.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompetitionPrompt for edit and NewCompetitionPromptFormGroupInput for create.
 */
type CompetitionPromptFormGroupInput = ICompetitionPrompt | PartialWithRequiredKeyOf<NewCompetitionPrompt>;

type CompetitionPromptFormDefaults = Pick<NewCompetitionPrompt, 'id'>;

type CompetitionPromptFormGroupContent = {
  id: FormControl<ICompetitionPrompt['id'] | NewCompetitionPrompt['id']>;
  linkedCompetition: FormControl<ICompetitionPrompt['linkedCompetition']>;
  promptContent: FormControl<ICompetitionPrompt['promptContent']>;
  post: FormControl<ICompetitionPrompt['post']>;
};

export type CompetitionPromptFormGroup = FormGroup<CompetitionPromptFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompetitionPromptFormService {
  createCompetitionPromptFormGroup(competitionPrompt: CompetitionPromptFormGroupInput = { id: null }): CompetitionPromptFormGroup {
    const competitionPromptRawValue = {
      ...this.getFormDefaults(),
      ...competitionPrompt,
    };
    return new FormGroup<CompetitionPromptFormGroupContent>({
      id: new FormControl(
        { value: competitionPromptRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      linkedCompetition: new FormControl(competitionPromptRawValue.linkedCompetition),
      promptContent: new FormControl(competitionPromptRawValue.promptContent),
      post: new FormControl(competitionPromptRawValue.post),
    });
  }

  getCompetitionPrompt(form: CompetitionPromptFormGroup): ICompetitionPrompt | NewCompetitionPrompt {
    return form.getRawValue() as ICompetitionPrompt | NewCompetitionPrompt;
  }

  resetForm(form: CompetitionPromptFormGroup, competitionPrompt: CompetitionPromptFormGroupInput): void {
    const competitionPromptRawValue = { ...this.getFormDefaults(), ...competitionPrompt };
    form.reset(
      {
        ...competitionPromptRawValue,
        id: { value: competitionPromptRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CompetitionPromptFormDefaults {
    return {
      id: null,
    };
  }
}
