import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompetitionPromptDetailComponent } from './competition-prompt-detail.component';

describe('CompetitionPrompt Management Detail Component', () => {
  let comp: CompetitionPromptDetailComponent;
  let fixture: ComponentFixture<CompetitionPromptDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitionPromptDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ competitionPrompt: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CompetitionPromptDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CompetitionPromptDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load competitionPrompt on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.competitionPrompt).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
