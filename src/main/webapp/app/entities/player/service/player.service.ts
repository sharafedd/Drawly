import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlayer, NewPlayer } from '../player.model';

export type PartialUpdatePlayer = Partial<IPlayer> & Pick<IPlayer, 'id'>;

export type EntityResponseType = HttpResponse<IPlayer>;
export type EntityArrayResponseType = HttpResponse<IPlayer[]>;

@Injectable({ providedIn: 'root' })
export class PlayerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/players');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(player: NewPlayer): Observable<EntityResponseType> {
    return this.http.post<IPlayer>(this.resourceUrl, player, { observe: 'response' });
  }

  update(player: IPlayer): Observable<EntityResponseType> {
    return this.http.put<IPlayer>(`${this.resourceUrl}/${this.getPlayerIdentifier(player)}`, player, { observe: 'response' });
  }

  partialUpdate(player: PartialUpdatePlayer): Observable<EntityResponseType> {
    return this.http.patch<IPlayer>(`${this.resourceUrl}/${this.getPlayerIdentifier(player)}`, player, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlayer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlayer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlayerIdentifier(player: Pick<IPlayer, 'id'>): number {
    return player.id;
  }

  comparePlayer(o1: Pick<IPlayer, 'id'> | null, o2: Pick<IPlayer, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlayerIdentifier(o1) === this.getPlayerIdentifier(o2) : o1 === o2;
  }

  addPlayerToCollectionIfMissing<Type extends Pick<IPlayer, 'id'>>(
    playerCollection: Type[],
    ...playersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const players: Type[] = playersToCheck.filter(isPresent);
    if (players.length > 0) {
      const playerCollectionIdentifiers = playerCollection.map(playerItem => this.getPlayerIdentifier(playerItem)!);
      const playersToAdd = players.filter(playerItem => {
        const playerIdentifier = this.getPlayerIdentifier(playerItem);
        if (playerCollectionIdentifiers.includes(playerIdentifier)) {
          return false;
        }
        playerCollectionIdentifiers.push(playerIdentifier);
        return true;
      });
      return [...playersToAdd, ...playerCollection];
    }
    return playerCollection;
  }
}
