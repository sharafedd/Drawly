import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PromptFormService } from './prompt-form.service';
import { PromptService } from '../service/prompt.service';
import { IPrompt } from '../prompt.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { PromptUpdateComponent } from './prompt-update.component';

describe('Prompt Management Update Component', () => {
  let comp: PromptUpdateComponent;
  let fixture: ComponentFixture<PromptUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let promptFormService: PromptFormService;
  let promptService: PromptService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PromptUpdateComponent],
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
      .overrideTemplate(PromptUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PromptUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    promptFormService = TestBed.inject(PromptFormService);
    promptService = TestBed.inject(PromptService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const prompt: IPrompt = { id: 456 };
      const post: IPost = { id: 52205 };
      prompt.post = post;

      const postCollection: IPost[] = [{ id: 30716 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prompt });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const prompt: IPrompt = { id: 456 };
      const post: IPost = { id: 79531 };
      prompt.post = post;

      activatedRoute.data = of({ prompt });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.prompt).toEqual(prompt);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrompt>>();
      const prompt = { id: 123 };
      jest.spyOn(promptFormService, 'getPrompt').mockReturnValue(prompt);
      jest.spyOn(promptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prompt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prompt }));
      saveSubject.complete();

      // THEN
      expect(promptFormService.getPrompt).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(promptService.update).toHaveBeenCalledWith(expect.objectContaining(prompt));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrompt>>();
      const prompt = { id: 123 };
      jest.spyOn(promptFormService, 'getPrompt').mockReturnValue({ id: null });
      jest.spyOn(promptService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prompt: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prompt }));
      saveSubject.complete();

      // THEN
      expect(promptFormService.getPrompt).toHaveBeenCalled();
      expect(promptService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrompt>>();
      const prompt = { id: 123 };
      jest.spyOn(promptService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prompt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(promptService.update).toHaveBeenCalled();
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
