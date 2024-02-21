import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompetitionDetailComponent } from './competition-detail.component';

describe('Competition Management Detail Component', () => {
  let comp: CompetitionDetailComponent;
  let fixture: ComponentFixture<CompetitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ competition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CompetitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CompetitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load competition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.competition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
