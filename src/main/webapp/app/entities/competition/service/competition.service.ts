import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompetition, NewCompetition } from '../competition.model';

export type PartialUpdateCompetition = Partial<ICompetition> & Pick<ICompetition, 'id'>;

export type EntityResponseType = HttpResponse<ICompetition>;
export type EntityArrayResponseType = HttpResponse<ICompetition[]>;

@Injectable({ providedIn: 'root' })
export class CompetitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/competitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(competition: NewCompetition): Observable<EntityResponseType> {
    return this.http.post<ICompetition>(this.resourceUrl, competition, { observe: 'response' });
  }

  update(competition: ICompetition): Observable<EntityResponseType> {
    return this.http.put<ICompetition>(`${this.resourceUrl}/${this.getCompetitionIdentifier(competition)}`, competition, {
      observe: 'response',
    });
  }

  partialUpdate(competition: PartialUpdateCompetition): Observable<EntityResponseType> {
    return this.http.patch<ICompetition>(`${this.resourceUrl}/${this.getCompetitionIdentifier(competition)}`, competition, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompetition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompetition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompetitionIdentifier(competition: Pick<ICompetition, 'id'>): number {
    return competition.id;
  }

  compareCompetition(o1: Pick<ICompetition, 'id'> | null, o2: Pick<ICompetition, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompetitionIdentifier(o1) === this.getCompetitionIdentifier(o2) : o1 === o2;
  }

  addCompetitionToCollectionIfMissing<Type extends Pick<ICompetition, 'id'>>(
    competitionCollection: Type[],
    ...competitionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const competitions: Type[] = competitionsToCheck.filter(isPresent);
    if (competitions.length > 0) {
      const competitionCollectionIdentifiers = competitionCollection.map(
        competitionItem => this.getCompetitionIdentifier(competitionItem)!
      );
      const competitionsToAdd = competitions.filter(competitionItem => {
        const competitionIdentifier = this.getCompetitionIdentifier(competitionItem);
        if (competitionCollectionIdentifiers.includes(competitionIdentifier)) {
          return false;
        }
        competitionCollectionIdentifiers.push(competitionIdentifier);
        return true;
      });
      return [...competitionsToAdd, ...competitionCollection];
    }
    return competitionCollection;
  }
}
