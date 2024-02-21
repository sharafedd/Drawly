import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompetitionFormService } from './competition-form.service';
import { CompetitionService } from '../service/competition.service';
import { ICompetition } from '../competition.model';
import { IPrompt } from 'app/entities/prompt/prompt.model';
import { PromptService } from 'app/entities/prompt/service/prompt.service';

import { CompetitionUpdateComponent } from './competition-update.component';

describe('Competition Management Update Component', () => {
  let comp: CompetitionUpdateComponent;
  let fixture: ComponentFixture<CompetitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let competitionFormService: CompetitionFormService;
  let competitionService: CompetitionService;
  let promptService: PromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompetitionUpdateComponent],
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
      .overrideTemplate(CompetitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompetitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    competitionFormService = TestBed.inject(CompetitionFormService);
    competitionService = TestBed.inject(CompetitionService);
    promptService = TestBed.inject(PromptService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Prompt query and add missing value', () => {
      const competition: ICompetition = { id: 456 };
      const prompt: IPrompt = { id: 55794 };
      competition.prompt = prompt;

      const promptCollection: IPrompt[] = [{ id: 2008 }];
      jest.spyOn(promptService, 'query').mockReturnValue(of(new HttpResponse({ body: promptCollection })));
      const additionalPrompts = [prompt];
      const expectedCollection: IPrompt[] = [...additionalPrompts, ...promptCollection];
      jest.spyOn(promptService, 'addPromptToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ competition });
      comp.ngOnInit();

      expect(promptService.query).toHaveBeenCalled();
      expect(promptService.addPromptToCollectionIfMissing).toHaveBeenCalledWith(
        promptCollection,
        ...additionalPrompts.map(expect.objectContaining)
      );
      expect(comp.promptsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const competition: ICompetition = { id: 456 };
      const prompt: IPrompt = { id: 62827 };
      competition.prompt = prompt;

      activatedRoute.data = of({ competition });
      comp.ngOnInit();

      expect(comp.promptsSharedCollection).toContain(prompt);
      expect(comp.competition).toEqual(competition);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetition>>();
      const competition = { id: 123 };
      jest.spyOn(competitionFormService, 'getCompetition').mockReturnValue(competition);
      jest.spyOn(competitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: competition }));
      saveSubject.complete();

      // THEN
      expect(competitionFormService.getCompetition).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(competitionService.update).toHaveBeenCalledWith(expect.objectContaining(competition));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetition>>();
      const competition = { id: 123 };
      jest.spyOn(competitionFormService, 'getCompetition').mockReturnValue({ id: null });
      jest.spyOn(competitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competition: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: competition }));
      saveSubject.complete();

      // THEN
      expect(competitionFormService.getCompetition).toHaveBeenCalled();
      expect(competitionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetition>>();
      const competition = { id: 123 };
      jest.spyOn(competitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(competitionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePrompt', () => {
      it('Should forward to promptService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(promptService, 'comparePrompt');
        comp.comparePrompt(entity, entity2);
        expect(promptService.comparePrompt).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
