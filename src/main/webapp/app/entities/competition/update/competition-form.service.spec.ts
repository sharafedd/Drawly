import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../competition.test-samples';

import { CompetitionFormService } from './competition-form.service';

describe('Competition Form Service', () => {
  let service: CompetitionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitionFormService);
  });

  describe('Service methods', () => {
    describe('createCompetitionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompetitionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            compType: expect.any(Object),
            totalParticipants: expect.any(Object),
            prompt: expect.any(Object),
          })
        );
      });

      it('passing ICompetition should create a new form with FormGroup', () => {
        const formGroup = service.createCompetitionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            compType: expect.any(Object),
            totalParticipants: expect.any(Object),
            prompt: expect.any(Object),
          })
        );
      });
    });

    describe('getCompetition', () => {
      it('should return NewCompetition for default Competition initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCompetitionFormGroup(sampleWithNewData);

        const competition = service.getCompetition(formGroup) as any;

        expect(competition).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompetition for empty Competition initial value', () => {
        const formGroup = service.createCompetitionFormGroup();

        const competition = service.getCompetition(formGroup) as any;

        expect(competition).toMatchObject({});
      });

      it('should return ICompetition', () => {
        const formGroup = service.createCompetitionFormGroup(sampleWithRequiredData);

        const competition = service.getCompetition(formGroup) as any;

        expect(competition).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompetition should not enable id FormControl', () => {
        const formGroup = service.createCompetitionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompetition should disable id FormControl', () => {
        const formGroup = service.createCompetitionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
