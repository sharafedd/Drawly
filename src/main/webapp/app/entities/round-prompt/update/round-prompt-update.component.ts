import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { RoundPromptFormService, RoundPromptFormGroup } from './round-prompt-form.service';
import { IRoundPrompt } from '../round-prompt.model';
import { RoundPromptService } from '../service/round-prompt.service';

@Component({
  selector: 'jhi-round-prompt-update',
  templateUrl: './round-prompt-update.component.html',
})
export class RoundPromptUpdateComponent implements OnInit {
  isSaving = false;
  roundPrompt: IRoundPrompt | null = null;

  editForm: RoundPromptFormGroup = this.roundPromptFormService.createRoundPromptFormGroup();

  constructor(
    protected roundPromptService: RoundPromptService,
    protected roundPromptFormService: RoundPromptFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roundPrompt }) => {
      this.roundPrompt = roundPrompt;
      if (roundPrompt) {
        this.updateForm(roundPrompt);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const roundPrompt = this.roundPromptFormService.getRoundPrompt(this.editForm);
    if (roundPrompt.id !== null) {
      this.subscribeToSaveResponse(this.roundPromptService.update(roundPrompt));
    } else {
      this.subscribeToSaveResponse(this.roundPromptService.create(roundPrompt));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoundPrompt>>): void {
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

  protected updateForm(roundPrompt: IRoundPrompt): void {
    this.roundPrompt = roundPrompt;
    this.roundPromptFormService.resetForm(this.editForm, roundPrompt);
  }
}
