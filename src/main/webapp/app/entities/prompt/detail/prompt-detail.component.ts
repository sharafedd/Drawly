import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPrompt } from '../prompt.model';

@Component({
  selector: 'jhi-prompt-detail',
  templateUrl: './prompt-detail.component.html',
})
export class PromptDetailComponent implements OnInit {
  prompt: IPrompt | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prompt }) => {
      this.prompt = prompt;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
