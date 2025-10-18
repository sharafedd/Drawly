import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RoundPromptService } from '../service/round-prompt.service';

import { RoundPromptComponent } from './round-prompt.component';

describe('RoundPrompt Management Component', () => {
  let comp: RoundPromptComponent;
  let fixture: ComponentFixture<RoundPromptComponent>;
  let service: RoundPromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'round-prompt', component: RoundPromptComponent }]), HttpClientTestingModule],
      declarations: [RoundPromptComponent],
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
      .overrideTemplate(RoundPromptComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoundPromptComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RoundPromptService);

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
    expect(comp.roundPrompts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to roundPromptService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRoundPromptIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRoundPromptIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
