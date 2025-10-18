import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CompetitionPromptFormService, CompetitionPromptFormGroup } from './competition-prompt-form.service';
import { ICompetitionPrompt } from '../competition-prompt.model';
import { CompetitionPromptService } from '../service/competition-prompt.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-competition-prompt-update',
  templateUrl: './competition-prompt-update.component.html',
})
export class CompetitionPromptUpdateComponent implements OnInit {
  isSaving = false;
  competitionPrompt: ICompetitionPrompt | null = null;

  postsSharedCollection: IPost[] = [];

  editForm: CompetitionPromptFormGroup = this.competitionPromptFormService.createCompetitionPromptFormGroup();

  constructor(
    protected competitionPromptService: CompetitionPromptService,
    protected competitionPromptFormService: CompetitionPromptFormService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ competitionPrompt }) => {
      this.competitionPrompt = competitionPrompt;
      if (competitionPrompt) {
        this.updateForm(competitionPrompt);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const competitionPrompt = this.competitionPromptFormService.getCompetitionPrompt(this.editForm);
    if (competitionPrompt.id !== null) {
      this.subscribeToSaveResponse(this.competitionPromptService.update(competitionPrompt));
    } else {
      this.subscribeToSaveResponse(this.competitionPromptService.create(competitionPrompt));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompetitionPrompt>>): void {
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

  protected updateForm(competitionPrompt: ICompetitionPrompt): void {
    this.competitionPrompt = competitionPrompt;
    this.competitionPromptFormService.resetForm(this.editForm, competitionPrompt);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, competitionPrompt.post);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.competitionPrompt?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
