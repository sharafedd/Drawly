import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RoundService } from '../service/round.service';

import { RoundComponent } from './round.component';

describe('Round Management Component', () => {
  let comp: RoundComponent;
  let fixture: ComponentFixture<RoundComponent>;
  let service: RoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'round', component: RoundComponent }]), HttpClientTestingModule],
      declarations: [RoundComponent],
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
      .overrideTemplate(RoundComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoundComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RoundService);

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
    expect(comp.rounds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to roundService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRoundIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRoundIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
