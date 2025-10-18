import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRound, NewRound } from '../round.model';

export type PartialUpdateRound = Partial<IRound> & Pick<IRound, 'id'>;

export type EntityResponseType = HttpResponse<IRound>;
export type EntityArrayResponseType = HttpResponse<IRound[]>;

@Injectable({ providedIn: 'root' })
export class RoundService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rounds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(round: NewRound): Observable<EntityResponseType> {
    return this.http.post<IRound>(this.resourceUrl, round, { observe: 'response' });
  }

  update(round: IRound): Observable<EntityResponseType> {
    return this.http.put<IRound>(`${this.resourceUrl}/${this.getRoundIdentifier(round)}`, round, { observe: 'response' });
  }

  partialUpdate(round: PartialUpdateRound): Observable<EntityResponseType> {
    return this.http.patch<IRound>(`${this.resourceUrl}/${this.getRoundIdentifier(round)}`, round, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRound>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRound[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRoundIdentifier(round: Pick<IRound, 'id'>): number {
    return round.id;
  }

  compareRound(o1: Pick<IRound, 'id'> | null, o2: Pick<IRound, 'id'> | null): boolean {
    return o1 && o2 ? this.getRoundIdentifier(o1) === this.getRoundIdentifier(o2) : o1 === o2;
  }

  addRoundToCollectionIfMissing<Type extends Pick<IRound, 'id'>>(
    roundCollection: Type[],
    ...roundsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rounds: Type[] = roundsToCheck.filter(isPresent);
    if (rounds.length > 0) {
      const roundCollectionIdentifiers = roundCollection.map(roundItem => this.getRoundIdentifier(roundItem)!);
      const roundsToAdd = rounds.filter(roundItem => {
        const roundIdentifier = this.getRoundIdentifier(roundItem);
        if (roundCollectionIdentifiers.includes(roundIdentifier)) {
          return false;
        }
        roundCollectionIdentifiers.push(roundIdentifier);
        return true;
      });
      return [...roundsToAdd, ...roundCollection];
    }
    return roundCollection;
  }
}
