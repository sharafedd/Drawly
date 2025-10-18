import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompetitionPromptFormService } from './competition-prompt-form.service';
import { CompetitionPromptService } from '../service/competition-prompt.service';
import { ICompetitionPrompt } from '../competition-prompt.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { CompetitionPromptUpdateComponent } from './competition-prompt-update.component';

describe('CompetitionPrompt Management Update Component', () => {
  let comp: CompetitionPromptUpdateComponent;
  let fixture: ComponentFixture<CompetitionPromptUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let competitionPromptFormService: CompetitionPromptFormService;
  let competitionPromptService: CompetitionPromptService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompetitionPromptUpdateComponent],
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
      .overrideTemplate(CompetitionPromptUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompetitionPromptUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    competitionPromptFormService = TestBed.inject(CompetitionPromptFormService);
    competitionPromptService = TestBed.inject(CompetitionPromptService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const competitionPrompt: ICompetitionPrompt = { id: 456 };
      const post: IPost = { id: 10628 };
      competitionPrompt.post = post;

      const postCollection: IPost[] = [{ id: 77118 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ competitionPrompt });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const competitionPrompt: ICompetitionPrompt = { id: 456 };
      const post: IPost = { id: 53637 };
      competitionPrompt.post = post;

      activatedRoute.data = of({ competitionPrompt });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.competitionPrompt).toEqual(competitionPrompt);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetitionPrompt>>();
      const competitionPrompt = { id: 123 };
      jest.spyOn(competitionPromptFormService, 'getCompetitionPrompt').mockReturnValue(competitionPrompt);
      jest.spyOn(competitionPromptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competitionPrompt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: competitionPrompt }));
      saveSubject.complete();

      // THEN
      expect(competitionPromptFormService.getCompetitionPrompt).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(competitionPromptService.update).toHaveBeenCalledWith(expect.objectContaining(competitionPrompt));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetitionPrompt>>();
      const competitionPrompt = { id: 123 };
      jest.spyOn(competitionPromptFormService, 'getCompetitionPrompt').mockReturnValue({ id: null });
      jest.spyOn(competitionPromptService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competitionPrompt: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: competitionPrompt }));
      saveSubject.complete();

      // THEN
      expect(competitionPromptFormService.getCompetitionPrompt).toHaveBeenCalled();
      expect(competitionPromptService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompetitionPrompt>>();
      const competitionPrompt = { id: 123 };
      jest.spyOn(competitionPromptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ competitionPrompt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(competitionPromptService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePost', () => {
      it('Should forward to postService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(postService, 'comparePost');
        comp.comparePost(entity, entity2);
        expect(postService.comparePost).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
