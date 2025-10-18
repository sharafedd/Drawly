import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRound } from '../round.model';

@Component({
  selector: 'jhi-round-detail',
  templateUrl: './round-detail.component.html',
})
export class RoundDetailComponent implements OnInit {
  round: IRound | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ round }) => {
      this.round = round;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
