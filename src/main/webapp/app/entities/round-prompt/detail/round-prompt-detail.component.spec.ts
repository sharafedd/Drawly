import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RoundPromptDetailComponent } from './round-prompt-detail.component';

describe('RoundPrompt Management Detail Component', () => {
  let comp: RoundPromptDetailComponent;
  let fixture: ComponentFixture<RoundPromptDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoundPromptDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ roundPrompt: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RoundPromptDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RoundPromptDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load roundPrompt on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.roundPrompt).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
