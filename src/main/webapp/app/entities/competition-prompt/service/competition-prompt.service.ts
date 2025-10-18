import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompetitionPrompt, NewCompetitionPrompt } from '../competition-prompt.model';

export type PartialUpdateCompetitionPrompt = Partial<ICompetitionPrompt> & Pick<ICompetitionPrompt, 'id'>;

export type EntityResponseType = HttpResponse<ICompetitionPrompt>;
export type EntityArrayResponseType = HttpResponse<ICompetitionPrompt[]>;

@Injectable({ providedIn: 'root' })
export class CompetitionPromptService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/competition-prompts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(competitionPrompt: NewCompetitionPrompt): Observable<EntityResponseType> {
    return this.http.post<ICompetitionPrompt>(this.resourceUrl, competitionPrompt, { observe: 'response' });
  }

  update(competitionPrompt: ICompetitionPrompt): Observable<EntityResponseType> {
    return this.http.put<ICompetitionPrompt>(
      `${this.resourceUrl}/${this.getCompetitionPromptIdentifier(competitionPrompt)}`,
      competitionPrompt,
      { observe: 'response' }
    );
  }

  partialUpdate(competitionPrompt: PartialUpdateCompetitionPrompt): Observable<EntityResponseType> {
    return this.http.patch<ICompetitionPrompt>(
      `${this.resourceUrl}/${this.getCompetitionPromptIdentifier(competitionPrompt)}`,
      competitionPrompt,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompetitionPrompt>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompetitionPrompt[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompetitionPromptIdentifier(competitionPrompt: Pick<ICompetitionPrompt, 'id'>): number {
    return competitionPrompt.id;
  }

  compareCompetitionPrompt(o1: Pick<ICompetitionPrompt, 'id'> | null, o2: Pick<ICompetitionPrompt, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompetitionPromptIdentifier(o1) === this.getCompetitionPromptIdentifier(o2) : o1 === o2;
  }

  addCompetitionPromptToCollectionIfMissing<Type extends Pick<ICompetitionPrompt, 'id'>>(
    competitionPromptCollection: Type[],
    ...competitionPromptsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const competitionPrompts: Type[] = competitionPromptsToCheck.filter(isPresent);
    if (competitionPrompts.length > 0) {
      const competitionPromptCollectionIdentifiers = competitionPromptCollection.map(
        competitionPromptItem => this.getCompetitionPromptIdentifier(competitionPromptItem)!
      );
      const competitionPromptsToAdd = competitionPrompts.filter(competitionPromptItem => {
        const competitionPromptIdentifier = this.getCompetitionPromptIdentifier(competitionPromptItem);
        if (competitionPromptCollectionIdentifiers.includes(competitionPromptIdentifier)) {
          return false;
        }
        competitionPromptCollectionIdentifiers.push(competitionPromptIdentifier);
        return true;
      });
      return [...competitionPromptsToAdd, ...competitionPromptCollection];
    }
    return competitionPromptCollection;
  }
}
