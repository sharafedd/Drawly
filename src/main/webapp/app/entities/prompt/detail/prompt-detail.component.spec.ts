import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PromptDetailComponent } from './prompt-detail.component';

describe('Prompt Management Detail Component', () => {
  let comp: PromptDetailComponent;
  let fixture: ComponentFixture<PromptDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ prompt: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PromptDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PromptDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load prompt on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.prompt).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
