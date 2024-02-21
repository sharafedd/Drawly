import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PromptFormService, PromptFormGroup } from './prompt-form.service';
import { IPrompt } from '../prompt.model';
import { PromptService } from '../service/prompt.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-prompt-update',
  templateUrl: './prompt-update.component.html',
})
export class PromptUpdateComponent implements OnInit {
  isSaving = false;
  prompt: IPrompt | null = null;

  postsSharedCollection: IPost[] = [];

  editForm: PromptFormGroup = this.promptFormService.createPromptFormGroup();

  constructor(
    protected promptService: PromptService,
    protected promptFormService: PromptFormService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prompt }) => {
      this.prompt = prompt;
      if (prompt) {
        this.updateForm(prompt);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prompt = this.promptFormService.getPrompt(this.editForm);
    if (prompt.id !== null) {
      this.subscribeToSaveResponse(this.promptService.update(prompt));
    } else {
      this.subscribeToSaveResponse(this.promptService.create(prompt));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrompt>>): void {
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

  protected updateForm(prompt: IPrompt): void {
    this.prompt = prompt;
    this.promptFormService.resetForm(this.editForm, prompt);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, prompt.post);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.prompt?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
