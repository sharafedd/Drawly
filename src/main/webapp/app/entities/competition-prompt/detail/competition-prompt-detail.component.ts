import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompetitionPrompt } from '../competition-prompt.model';

@Component({
  selector: 'jhi-competition-prompt-detail',
  templateUrl: './competition-prompt-detail.component.html',
})
export class CompetitionPromptDetailComponent implements OnInit {
  competitionPrompt: ICompetitionPrompt | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ competitionPrompt }) => {
      this.competitionPrompt = competitionPrompt;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
