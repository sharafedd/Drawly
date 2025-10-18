import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompetitionPrompt } from '../competition-prompt.model';
import { CompetitionPromptService } from '../service/competition-prompt.service';

@Injectable({ providedIn: 'root' })
export class CompetitionPromptRoutingResolveService implements Resolve<ICompetitionPrompt | null> {
  constructor(protected service: CompetitionPromptService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICompetitionPrompt | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((competitionPrompt: HttpResponse<ICompetitionPrompt>) => {
          if (competitionPrompt.body) {
            return of(competitionPrompt.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
