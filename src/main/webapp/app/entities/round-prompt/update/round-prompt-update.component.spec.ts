import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RoundPromptFormService } from './round-prompt-form.service';
import { RoundPromptService } from '../service/round-prompt.service';
import { IRoundPrompt } from '../round-prompt.model';

import { RoundPromptUpdateComponent } from './round-prompt-update.component';

describe('RoundPrompt Management Update Component', () => {
  let comp: RoundPromptUpdateComponent;
  let fixture: ComponentFixture<RoundPromptUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let roundPromptFormService: RoundPromptFormService;
  let roundPromptService: RoundPromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RoundPromptUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RoundPromptUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoundPromptUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    roundPromptFormService = TestBed.inject(RoundPromptFormService);
    roundPromptService = TestBed.inject(RoundPromptService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const roundPrompt: IRoundPrompt = { id: 456 };

      activatedRoute.data = of({ roundPrompt });
      comp.ngOnInit();

      expect(comp.roundPrompt).toEqual(roundPrompt);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoundPrompt>>();
      const roundPrompt = { id: 123 };
      jest.spyOn(roundPromptFormService, 'getRoundPrompt').mockReturnValue(roundPrompt);
      jest.spyOn(roundPromptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roundPrompt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roundPrompt }));
      saveSubject.complete();

      // THEN
      expect(roundPromptFormService.getRoundPrompt).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(roundPromptService.update).toHaveBeenCalledWith(expect.objectContaining(roundPrompt));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoundPrompt>>();
      const roundPrompt = { id: 123 };
      jest.spyOn(roundPromptFormService, 'getRoundPrompt').mockReturnValue({ id: null });
      jest.spyOn(roundPromptService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roundPrompt: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roundPrompt }));
      saveSubject.complete();

      // THEN
      expect(roundPromptFormService.getRoundPrompt).toHaveBeenCalled();
      expect(roundPromptService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoundPrompt>>();
      const roundPrompt = { id: 123 };
      jest.spyOn(roundPromptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roundPrompt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(roundPromptService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
