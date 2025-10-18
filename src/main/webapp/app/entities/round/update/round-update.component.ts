import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RoundFormService, RoundFormGroup } from './round-form.service';
import { IRound } from '../round.model';
import { RoundService } from '../service/round.service';
import { IRoundPrompt } from 'app/entities/round-prompt/round-prompt.model';
import { RoundPromptService } from 'app/entities/round-prompt/service/round-prompt.service';

@Component({
  selector: 'jhi-round-update',
  templateUrl: './round-update.component.html',
})
export class RoundUpdateComponent implements OnInit {
  isSaving = false;
  round: IRound | null = null;

  roundPromptsCollection: IRoundPrompt[] = [];

  editForm: RoundFormGroup = this.roundFormService.createRoundFormGroup();

  constructor(
    protected roundService: RoundService,
    protected roundFormService: RoundFormService,
    protected roundPromptService: RoundPromptService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRoundPrompt = (o1: IRoundPrompt | null, o2: IRoundPrompt | null): boolean => this.roundPromptService.compareRoundPrompt(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ round }) => {
      this.round = round;
      if (round) {
        this.updateForm(round);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const round = this.roundFormService.getRound(this.editForm);
    if (round.id !== null) {
      this.subscribeToSaveResponse(this.roundService.update(round));
    } else {
      this.subscribeToSaveResponse(this.roundService.create(round));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRound>>): void {
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

  protected updateForm(round: IRound): void {
    this.round = round;
    this.roundFormService.resetForm(this.editForm, round);

    this.roundPromptsCollection = this.roundPromptService.addRoundPromptToCollectionIfMissing<IRoundPrompt>(
      this.roundPromptsCollection,
      round.roundPrompt
    );
  }

  protected loadRelationshipsOptions(): void {
    this.roundPromptService
      .query({ filter: 'round-is-null' })
      .pipe(map((res: HttpResponse<IRoundPrompt[]>) => res.body ?? []))
      .pipe(
        map((roundPrompts: IRoundPrompt[]) =>
          this.roundPromptService.addRoundPromptToCollectionIfMissing<IRoundPrompt>(roundPrompts, this.round?.roundPrompt)
        )
      )
      .subscribe((roundPrompts: IRoundPrompt[]) => (this.roundPromptsCollection = roundPrompts));
  }
}
