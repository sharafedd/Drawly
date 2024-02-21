import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CompetitionFormService, CompetitionFormGroup } from './competition-form.service';
import { ICompetition } from '../competition.model';
import { CompetitionService } from '../service/competition.service';
import { IPrompt } from 'app/entities/prompt/prompt.model';
import { PromptService } from 'app/entities/prompt/service/prompt.service';

@Component({
  selector: 'jhi-competition-update',
  templateUrl: './competition-update.component.html',
})
export class CompetitionUpdateComponent implements OnInit {
  isSaving = false;
  competition: ICompetition | null = null;

  promptsSharedCollection: IPrompt[] = [];

  editForm: CompetitionFormGroup = this.competitionFormService.createCompetitionFormGroup();

  constructor(
    protected competitionService: CompetitionService,
    protected competitionFormService: CompetitionFormService,
    protected promptService: PromptService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePrompt = (o1: IPrompt | null, o2: IPrompt | null): boolean => this.promptService.comparePrompt(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ competition }) => {
      this.competition = competition;
      if (competition) {
        this.updateForm(competition);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const competition = this.competitionFormService.getCompetition(this.editForm);
    if (competition.id !== null) {
      this.subscribeToSaveResponse(this.competitionService.update(competition));
    } else {
      this.subscribeToSaveResponse(this.competitionService.create(competition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompetition>>): void {
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

  protected updateForm(competition: ICompetition): void {
    this.competition = competition;
    this.competitionFormService.resetForm(this.editForm, competition);

    this.promptsSharedCollection = this.promptService.addPromptToCollectionIfMissing<IPrompt>(
      this.promptsSharedCollection,
      competition.prompt
    );
  }

  protected loadRelationshipsOptions(): void {
    this.promptService
      .query()
      .pipe(map((res: HttpResponse<IPrompt[]>) => res.body ?? []))
      .pipe(map((prompts: IPrompt[]) => this.promptService.addPromptToCollectionIfMissing<IPrompt>(prompts, this.competition?.prompt)))
      .subscribe((prompts: IPrompt[]) => (this.promptsSharedCollection = prompts));
  }
}
