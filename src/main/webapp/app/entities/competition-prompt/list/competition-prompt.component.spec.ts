import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompetitionPromptService } from '../service/competition-prompt.service';

import { CompetitionPromptComponent } from './competition-prompt.component';

describe('CompetitionPrompt Management Component', () => {
  let comp: CompetitionPromptComponent;
  let fixture: ComponentFixture<CompetitionPromptComponent>;
  let service: CompetitionPromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'competition-prompt', component: CompetitionPromptComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [CompetitionPromptComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CompetitionPromptComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompetitionPromptComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompetitionPromptService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.competitionPrompts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to competitionPromptService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompetitionPromptIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompetitionPromptIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
