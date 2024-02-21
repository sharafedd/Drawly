import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PromptService } from '../service/prompt.service';

import { PromptComponent } from './prompt.component';

describe('Prompt Management Component', () => {
  let comp: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;
  let service: PromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'prompt', component: PromptComponent }]), HttpClientTestingModule],
      declarations: [PromptComponent],
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
      .overrideTemplate(PromptComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PromptComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PromptService);

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
    expect(comp.prompts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to promptService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPromptIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPromptIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
