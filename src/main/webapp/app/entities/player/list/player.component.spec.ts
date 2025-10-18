import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PlayerService } from '../service/player.service';

import { PlayerComponent } from './player.component';

describe('Player Management Component', () => {
  let comp: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let service: PlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'player', component: PlayerComponent }]), HttpClientTestingModule],
      declarations: [PlayerComponent],
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
      .overrideTemplate(PlayerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PlayerService);

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
    expect(comp.players?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to playerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPlayerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPlayerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
