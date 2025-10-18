import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRoundPrompt } from '../round-prompt.model';
import { RoundPromptService } from '../service/round-prompt.service';

@Injectable({ providedIn: 'root' })
export class RoundPromptRoutingResolveService implements Resolve<IRoundPrompt | null> {
  constructor(protected service: RoundPromptService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoundPrompt | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((roundPrompt: HttpResponse<IRoundPrompt>) => {
          if (roundPrompt.body) {
            return of(roundPrompt.body);
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
