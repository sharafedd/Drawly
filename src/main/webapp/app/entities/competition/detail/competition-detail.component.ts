import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompetition } from '../competition.model';

@Component({
  selector: 'jhi-competition-detail',
  templateUrl: './competition-detail.component.html',
})
export class CompetitionDetailComponent implements OnInit {
  competition: ICompetition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ competition }) => {
      this.competition = competition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
