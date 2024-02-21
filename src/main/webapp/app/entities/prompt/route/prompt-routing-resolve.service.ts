import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPrompt } from '../prompt.model';
import { PromptService } from '../service/prompt.service';

@Injectable({ providedIn: 'root' })
export class PromptRoutingResolveService implements Resolve<IPrompt | null> {
  constructor(protected service: PromptService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPrompt | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((prompt: HttpResponse<IPrompt>) => {
          if (prompt.body) {
            return of(prompt.body);
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
