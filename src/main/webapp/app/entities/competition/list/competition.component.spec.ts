import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompetitionService } from '../service/competition.service';

import { CompetitionComponent } from './competition.component';

describe('Competition Management Component', () => {
  let comp: CompetitionComponent;
  let fixture: ComponentFixture<CompetitionComponent>;
  let service: CompetitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'competition', component: CompetitionComponent }]), HttpClientTestingModule],
      declarations: [CompetitionComponent],
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
      .overrideTemplate(CompetitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompetitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompetitionService);

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
    expect(comp.competitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to competitionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompetitionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompetitionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
