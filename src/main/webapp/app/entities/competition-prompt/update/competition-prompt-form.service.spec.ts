import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../competition-prompt.test-samples';

import { CompetitionPromptFormService } from './competition-prompt-form.service';

describe('CompetitionPrompt Form Service', () => {
  let service: CompetitionPromptFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitionPromptFormService);
  });

  describe('Service methods', () => {
    describe('createCompetitionPromptFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompetitionPromptFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            linkedCompetition: expect.any(Object),
            promptContent: expect.any(Object),
            post: expect.any(Object),
          })
        );
      });

      it('passing ICompetitionPrompt should create a new form with FormGroup', () => {
        const formGroup = service.createCompetitionPromptFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            linkedCompetition: expect.any(Object),
            promptContent: expect.any(Object),
            post: expect.any(Object),
          })
        );
      });
    });

    describe('getCompetitionPrompt', () => {
      it('should return NewCompetitionPrompt for default CompetitionPrompt initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCompetitionPromptFormGroup(sampleWithNewData);

        const competitionPrompt = service.getCompetitionPrompt(formGroup) as any;

        expect(competitionPrompt).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompetitionPrompt for empty CompetitionPrompt initial value', () => {
        const formGroup = service.createCompetitionPromptFormGroup();

        const competitionPrompt = service.getCompetitionPrompt(formGroup) as any;

        expect(competitionPrompt).toMatchObject({});
      });

      it('should return ICompetitionPrompt', () => {
        const formGroup = service.createCompetitionPromptFormGroup(sampleWithRequiredData);

        const competitionPrompt = service.getCompetitionPrompt(formGroup) as any;

        expect(competitionPrompt).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompetitionPrompt should not enable id FormControl', () => {
        const formGroup = service.createCompetitionPromptFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompetitionPrompt should disable id FormControl', () => {
        const formGroup = service.createCompetitionPromptFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
