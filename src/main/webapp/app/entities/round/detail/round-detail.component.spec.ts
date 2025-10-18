import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RoundDetailComponent } from './round-detail.component';

describe('Round Management Detail Component', () => {
  let comp: RoundDetailComponent;
  let fixture: ComponentFixture<RoundDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoundDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ round: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RoundDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RoundDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load round on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.round).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
