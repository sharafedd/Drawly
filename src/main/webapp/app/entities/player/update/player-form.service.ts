import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPlayer, NewPlayer } from '../player.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlayer for edit and NewPlayerFormGroupInput for create.
 */
type PlayerFormGroupInput = IPlayer | PartialWithRequiredKeyOf<NewPlayer>;

type PlayerFormDefaults = Pick<NewPlayer, 'id'>;

type PlayerFormGroupContent = {
  id: FormControl<IPlayer['id'] | NewPlayer['id']>;
  linkedUser: FormControl<IPlayer['linkedUser']>;
  linkedRoom: FormControl<IPlayer['linkedRoom']>;
  username: FormControl<IPlayer['username']>;
  drawing: FormControl<IPlayer['drawing']>;
  drawingContentType: FormControl<IPlayer['drawingContentType']>;
  totalStars: FormControl<IPlayer['totalStars']>;
  rank: FormControl<IPlayer['rank']>;
};

export type PlayerFormGroup = FormGroup<PlayerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlayerFormService {
  createPlayerFormGroup(player: PlayerFormGroupInput = { id: null }): PlayerFormGroup {
    const playerRawValue = {
      ...this.getFormDefaults(),
      ...player,
    };
    return new FormGroup<PlayerFormGroupContent>({
      id: new FormControl(
        { value: playerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      linkedUser: new FormControl(playerRawValue.linkedUser),
      linkedRoom: new FormControl(playerRawValue.linkedRoom),
      username: new FormControl(playerRawValue.username),
      drawing: new FormControl(playerRawValue.drawing),
      drawingContentType: new FormControl(playerRawValue.drawingContentType),
      totalStars: new FormControl(playerRawValue.totalStars),
      rank: new FormControl(playerRawValue.rank),
    });
  }

  getPlayer(form: PlayerFormGroup): IPlayer | NewPlayer {
    return form.getRawValue() as IPlayer | NewPlayer;
  }

  resetForm(form: PlayerFormGroup, player: PlayerFormGroupInput): void {
    const playerRawValue = { ...this.getFormDefaults(), ...player };
    form.reset(
      {
        ...playerRawValue,
        id: { value: playerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PlayerFormDefaults {
    return {
      id: null,
    };
  }
}
