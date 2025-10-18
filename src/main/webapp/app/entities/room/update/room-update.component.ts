import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RoomFormService, RoomFormGroup } from './room-form.service';
import { IRoom } from '../room.model';
import { RoomService } from '../service/room.service';
import { IPlayer } from 'app/entities/player/player.model';
import { PlayerService } from 'app/entities/player/service/player.service';
import { IRound } from 'app/entities/round/round.model';
import { RoundService } from 'app/entities/round/service/round.service';
import { IRoundPrompt } from 'app/entities/round-prompt/round-prompt.model';
import { RoundPromptService } from 'app/entities/round-prompt/service/round-prompt.service';
import { RoomType } from 'app/entities/enumerations/room-type.model';

@Component({
  selector: 'jhi-room-update',
  templateUrl: './room-update.component.html',
})
export class RoomUpdateComponent implements OnInit {
  isSaving = false;
  room: IRoom | null = null;
  roomTypeValues = Object.keys(RoomType);

  playersSharedCollection: IPlayer[] = [];
  roundsSharedCollection: IRound[] = [];
  roundPromptsSharedCollection: IRoundPrompt[] = [];

  editForm: RoomFormGroup = this.roomFormService.createRoomFormGroup();

  constructor(
    protected roomService: RoomService,
    protected roomFormService: RoomFormService,
    protected playerService: PlayerService,
    protected roundService: RoundService,
    protected roundPromptService: RoundPromptService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePlayer = (o1: IPlayer | null, o2: IPlayer | null): boolean => this.playerService.comparePlayer(o1, o2);

  compareRound = (o1: IRound | null, o2: IRound | null): boolean => this.roundService.compareRound(o1, o2);

  compareRoundPrompt = (o1: IRoundPrompt | null, o2: IRoundPrompt | null): boolean => this.roundPromptService.compareRoundPrompt(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ room }) => {
      this.room = room;
      if (room) {
        this.updateForm(room);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const room = this.roomFormService.getRoom(this.editForm);
    if (room.id !== null) {
      this.subscribeToSaveResponse(this.roomService.update(room));
    } else {
      this.subscribeToSaveResponse(this.roomService.create(room));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoom>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(room: IRoom): void {
    this.room = room;
    this.roomFormService.resetForm(this.editForm, room);

    this.playersSharedCollection = this.playerService.addPlayerToCollectionIfMissing<IPlayer>(this.playersSharedCollection, room.player);
    this.roundsSharedCollection = this.roundService.addRoundToCollectionIfMissing<IRound>(this.roundsSharedCollection, room.round);
    this.roundPromptsSharedCollection = this.roundPromptService.addRoundPromptToCollectionIfMissing<IRoundPrompt>(
      this.roundPromptsSharedCollection,
      room.roundPrompt
    );
  }

  protected loadRelationshipsOptions(): void {
    this.playerService
      .query()
      .pipe(map((res: HttpResponse<IPlayer[]>) => res.body ?? []))
      .pipe(map((players: IPlayer[]) => this.playerService.addPlayerToCollectionIfMissing<IPlayer>(players, this.room?.player)))
      .subscribe((players: IPlayer[]) => (this.playersSharedCollection = players));

    this.roundService
      .query()
      .pipe(map((res: HttpResponse<IRound[]>) => res.body ?? []))
      .pipe(map((rounds: IRound[]) => this.roundService.addRoundToCollectionIfMissing<IRound>(rounds, this.room?.round)))
      .subscribe((rounds: IRound[]) => (this.roundsSharedCollection = rounds));

    this.roundPromptService
      .query()
      .pipe(map((res: HttpResponse<IRoundPrompt[]>) => res.body ?? []))
      .pipe(
        map((roundPrompts: IRoundPrompt[]) =>
          this.roundPromptService.addRoundPromptToCollectionIfMissing<IRoundPrompt>(roundPrompts, this.room?.roundPrompt)
        )
      )
      .subscribe((roundPrompts: IRoundPrompt[]) => (this.roundPromptsSharedCollection = roundPrompts));
  }
}
