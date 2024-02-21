import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPrompt, NewPrompt } from '../prompt.model';

export type PartialUpdatePrompt = Partial<IPrompt> & Pick<IPrompt, 'id'>;

type RestOf<T extends IPrompt | NewPrompt> = Omit<T, 'promptDeadline'> & {
  promptDeadline?: string | null;
};

export type RestPrompt = RestOf<IPrompt>;

export type NewRestPrompt = RestOf<NewPrompt>;

export type PartialUpdateRestPrompt = RestOf<PartialUpdatePrompt>;

export type EntityResponseType = HttpResponse<IPrompt>;
export type EntityArrayResponseType = HttpResponse<IPrompt[]>;

@Injectable({ providedIn: 'root' })
export class PromptService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prompts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(prompt: NewPrompt): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prompt);
    return this.http
      .post<RestPrompt>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(prompt: IPrompt): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prompt);
    return this.http
      .put<RestPrompt>(`${this.resourceUrl}/${this.getPromptIdentifier(prompt)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(prompt: PartialUpdatePrompt): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prompt);
    return this.http
      .patch<RestPrompt>(`${this.resourceUrl}/${this.getPromptIdentifier(prompt)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPrompt>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPrompt[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPromptIdentifier(prompt: Pick<IPrompt, 'id'>): number {
    return prompt.id;
  }

  comparePrompt(o1: Pick<IPrompt, 'id'> | null, o2: Pick<IPrompt, 'id'> | null): boolean {
    return o1 && o2 ? this.getPromptIdentifier(o1) === this.getPromptIdentifier(o2) : o1 === o2;
  }

  addPromptToCollectionIfMissing<Type extends Pick<IPrompt, 'id'>>(
    promptCollection: Type[],
    ...promptsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const prompts: Type[] = promptsToCheck.filter(isPresent);
    if (prompts.length > 0) {
      const promptCollectionIdentifiers = promptCollection.map(promptItem => this.getPromptIdentifier(promptItem)!);
      const promptsToAdd = prompts.filter(promptItem => {
        const promptIdentifier = this.getPromptIdentifier(promptItem);
        if (promptCollectionIdentifiers.includes(promptIdentifier)) {
          return false;
        }
        promptCollectionIdentifiers.push(promptIdentifier);
        return true;
      });
      return [...promptsToAdd, ...promptCollection];
    }
    return promptCollection;
  }

  protected convertDateFromClient<T extends IPrompt | NewPrompt | PartialUpdatePrompt>(prompt: T): RestOf<T> {
    return {
      ...prompt,
      promptDeadline: prompt.promptDeadline?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPrompt: RestPrompt): IPrompt {
    return {
      ...restPrompt,
      promptDeadline: restPrompt.promptDeadline ? dayjs(restPrompt.promptDeadline) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPrompt>): HttpResponse<IPrompt> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPrompt[]>): HttpResponse<IPrompt[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
