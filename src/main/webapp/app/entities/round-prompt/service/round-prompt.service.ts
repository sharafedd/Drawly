import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRoundPrompt, NewRoundPrompt } from '../round-prompt.model';

export type PartialUpdateRoundPrompt = Partial<IRoundPrompt> & Pick<IRoundPrompt, 'id'>;

export type EntityResponseType = HttpResponse<IRoundPrompt>;
export type EntityArrayResponseType = HttpResponse<IRoundPrompt[]>;

@Injectable({ providedIn: 'root' })
export class RoundPromptService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/round-prompts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(roundPrompt: NewRoundPrompt): Observable<EntityResponseType> {
    return this.http.post<IRoundPrompt>(this.resourceUrl, roundPrompt, { observe: 'response' });
  }

  update(roundPrompt: IRoundPrompt): Observable<EntityResponseType> {
    return this.http.put<IRoundPrompt>(`${this.resourceUrl}/${this.getRoundPromptIdentifier(roundPrompt)}`, roundPrompt, {
      observe: 'response',
    });
  }

  partialUpdate(roundPrompt: PartialUpdateRoundPrompt): Observable<EntityResponseType> {
    return this.http.patch<IRoundPrompt>(`${this.resourceUrl}/${this.getRoundPromptIdentifier(roundPrompt)}`, roundPrompt, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRoundPrompt>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRoundPrompt[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRoundPromptIdentifier(roundPrompt: Pick<IRoundPrompt, 'id'>): number {
    return roundPrompt.id;
  }

  compareRoundPrompt(o1: Pick<IRoundPrompt, 'id'> | null, o2: Pick<IRoundPrompt, 'id'> | null): boolean {
    return o1 && o2 ? this.getRoundPromptIdentifier(o1) === this.getRoundPromptIdentifier(o2) : o1 === o2;
  }

  addRoundPromptToCollectionIfMissing<Type extends Pick<IRoundPrompt, 'id'>>(
    roundPromptCollection: Type[],
    ...roundPromptsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const roundPrompts: Type[] = roundPromptsToCheck.filter(isPresent);
    if (roundPrompts.length > 0) {
      const roundPromptCollectionIdentifiers = roundPromptCollection.map(
        roundPromptItem => this.getRoundPromptIdentifier(roundPromptItem)!
      );
      const roundPromptsToAdd = roundPrompts.filter(roundPromptItem => {
        const roundPromptIdentifier = this.getRoundPromptIdentifier(roundPromptItem);
        if (roundPromptCollectionIdentifiers.includes(roundPromptIdentifier)) {
          return false;
        }
        roundPromptCollectionIdentifiers.push(roundPromptIdentifier);
        return true;
      });
      return [...roundPromptsToAdd, ...roundPromptCollection];
    }
    return roundPromptCollection;
  }
}
