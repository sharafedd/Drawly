import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CompetitionFormService, CompetitionFormGroup } from './competition-form.service';
import { ICompetition } from '../competition.model';
import { CompetitionService } from '../service/competition.service';
import { ICompetitionPrompt } from 'app/entities/competition-prompt/competition-prompt.model';
import { CompetitionPromptService } from 'app/entities/competition-prompt/service/competition-prompt.service';
import { CompetitionType } from 'app/entities/enumerations/competition-type.model';

@Component({
  selector: 'jhi-competition-update',
  templateUrl: './competition-update.component.html',
})
export class CompetitionUpdateComponent implements OnInit {
  isSaving = false;
  competition: ICompetition | null = null;
  competitionTypeValues = Object.keys(CompetitionType);

  competitionPromptsCollection: ICompetitionPrompt[] = [];

  editForm: CompetitionFormGroup = this.competitionFormService.createCompetitionFormGroup();

  constructor(
    protected competitionService: CompetitionService,
    protected competitionFormService: CompetitionFormService,
    protected competitionPromptService: CompetitionPromptService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCompetitionPrompt = (o1: ICompetitionPrompt | null, o2: ICompetitionPrompt | null): boolean =>
    this.competitionPromptService.compareCompetitionPrompt(o1, o2);

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

    this.competitionPromptsCollection = this.competitionPromptService.addCompetitionPromptToCollectionIfMissing<ICompetitionPrompt>(
      this.competitionPromptsCollection,
      competition.competitionPrompt
    );
  }

  protected loadRelationshipsOptions(): void {
    this.competitionPromptService
      .query({ filter: 'competition-is-null' })
      .pipe(map((res: HttpResponse<ICompetitionPrompt[]>) => res.body ?? []))
      .pipe(
        map((competitionPrompts: ICompetitionPrompt[]) =>
          this.competitionPromptService.addCompetitionPromptToCollectionIfMissing<ICompetitionPrompt>(
            competitionPrompts,
            this.competition?.competitionPrompt
          )
        )
      )
      .subscribe((competitionPrompts: ICompetitionPrompt[]) => (this.competitionPromptsCollection = competitionPrompts));
  }
}
