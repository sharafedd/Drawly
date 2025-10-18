import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRoom, NewRoom } from '../room.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRoom for edit and NewRoomFormGroupInput for create.
 */
type RoomFormGroupInput = IRoom | PartialWithRequiredKeyOf<NewRoom>;

type RoomFormDefaults = Pick<NewRoom, 'id'>;

type RoomFormGroupContent = {
  id: FormControl<IRoom['id'] | NewRoom['id']>;
  noOfRounds: FormControl<IRoom['noOfRounds']>;
  noOfPlayers: FormControl<IRoom['noOfPlayers']>;
  roomType: FormControl<IRoom['roomType']>;
  roomCode: FormControl<IRoom['roomCode']>;
  theme: FormControl<IRoom['theme']>;
  player: FormControl<IRoom['player']>;
  round: FormControl<IRoom['round']>;
  roundPrompt: FormControl<IRoom['roundPrompt']>;
};

export type RoomFormGroup = FormGroup<RoomFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RoomFormService {
  createRoomFormGroup(room: RoomFormGroupInput = { id: null }): RoomFormGroup {
    const roomRawValue = {
      ...this.getFormDefaults(),
      ...room,
    };
    return new FormGroup<RoomFormGroupContent>({
      id: new FormControl(
        { value: roomRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      noOfRounds: new FormControl(roomRawValue.noOfRounds),
      noOfPlayers: new FormControl(roomRawValue.noOfPlayers),
      roomType: new FormControl(roomRawValue.roomType),
      roomCode: new FormControl(roomRawValue.roomCode),
      theme: new FormControl(roomRawValue.theme),
      player: new FormControl(roomRawValue.player),
      round: new FormControl(roomRawValue.round),
      roundPrompt: new FormControl(roomRawValue.roundPrompt),
    });
  }

  getRoom(form: RoomFormGroup): IRoom | NewRoom {
    return form.getRawValue() as IRoom | NewRoom;
  }

  resetForm(form: RoomFormGroup, room: RoomFormGroupInput): void {
    const roomRawValue = { ...this.getFormDefaults(), ...room };
    form.reset(
      {
        ...roomRawValue,
        id: { value: roomRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RoomFormDefaults {
    return {
      id: null,
    };
  }
}
