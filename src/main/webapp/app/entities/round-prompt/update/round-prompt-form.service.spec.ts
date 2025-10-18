import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../round-prompt.test-samples';

import { RoundPromptFormService } from './round-prompt-form.service';

describe('RoundPrompt Form Service', () => {
  let service: RoundPromptFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundPromptFormService);
  });

  describe('Service methods', () => {
    describe('createRoundPromptFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRoundPromptFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            linkedRoom: expect.any(Object),
            linkedRound: expect.any(Object),
            content: expect.any(Object),
          })
        );
      });

      it('passing IRoundPrompt should create a new form with FormGroup', () => {
        const formGroup = service.createRoundPromptFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            linkedRoom: expect.any(Object),
            linkedRound: expect.any(Object),
            content: expect.any(Object),
          })
        );
      });
    });

    describe('getRoundPrompt', () => {
      it('should return NewRoundPrompt for default RoundPrompt initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRoundPromptFormGroup(sampleWithNewData);

        const roundPrompt = service.getRoundPrompt(formGroup) as any;

        expect(roundPrompt).toMatchObject(sampleWithNewData);
      });

      it('should return NewRoundPrompt for empty RoundPrompt initial value', () => {
        const formGroup = service.createRoundPromptFormGroup();

        const roundPrompt = service.getRoundPrompt(formGroup) as any;

        expect(roundPrompt).toMatchObject({});
      });

      it('should return IRoundPrompt', () => {
        const formGroup = service.createRoundPromptFormGroup(sampleWithRequiredData);

        const roundPrompt = service.getRoundPrompt(formGroup) as any;

        expect(roundPrompt).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRoundPrompt should not enable id FormControl', () => {
        const formGroup = service.createRoundPromptFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRoundPrompt should disable id FormControl', () => {
        const formGroup = service.createRoundPromptFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
