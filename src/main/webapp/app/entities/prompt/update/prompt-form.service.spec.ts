import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prompt.test-samples';

import { PromptFormService } from './prompt-form.service';

describe('Prompt Form Service', () => {
  let service: PromptFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromptFormService);
  });

  describe('Service methods', () => {
    describe('createPromptFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPromptFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            promptID: expect.any(Object),
            promptContent: expect.any(Object),
            promptDeadline: expect.any(Object),
            participantsNum: expect.any(Object),
            post: expect.any(Object),
          })
        );
      });

      it('passing IPrompt should create a new form with FormGroup', () => {
        const formGroup = service.createPromptFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            promptID: expect.any(Object),
            promptContent: expect.any(Object),
            promptDeadline: expect.any(Object),
            participantsNum: expect.any(Object),
            post: expect.any(Object),
          })
        );
      });
    });

    describe('getPrompt', () => {
      it('should return NewPrompt for default Prompt initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPromptFormGroup(sampleWithNewData);

        const prompt = service.getPrompt(formGroup) as any;

        expect(prompt).toMatchObject(sampleWithNewData);
      });

      it('should return NewPrompt for empty Prompt initial value', () => {
        const formGroup = service.createPromptFormGroup();

        const prompt = service.getPrompt(formGroup) as any;

        expect(prompt).toMatchObject({});
      });

      it('should return IPrompt', () => {
        const formGroup = service.createPromptFormGroup(sampleWithRequiredData);

        const prompt = service.getPrompt(formGroup) as any;

        expect(prompt).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPrompt should not enable id FormControl', () => {
        const formGroup = service.createPromptFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPrompt should disable id FormControl', () => {
        const formGroup = service.createPromptFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
