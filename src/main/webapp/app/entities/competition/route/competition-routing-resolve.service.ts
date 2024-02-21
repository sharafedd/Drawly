import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompetition } from '../competition.model';
import { CompetitionService } from '../service/competition.service';

@Injectable({ providedIn: 'root' })
export class CompetitionRoutingResolveService implements Resolve<ICompetition | null> {
  constructor(protected service: CompetitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICompetition | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((competition: HttpResponse<ICompetition>) => {
          if (competition.body) {
            return of(competition.body);
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
