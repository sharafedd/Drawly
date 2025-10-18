import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoundPrompt } from '../round-prompt.model';

@Component({
  selector: 'jhi-round-prompt-detail',
  templateUrl: './round-prompt-detail.component.html',
})
export class RoundPromptDetailComponent implements OnInit {
  roundPrompt: IRoundPrompt | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roundPrompt }) => {
      this.roundPrompt = roundPrompt;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
