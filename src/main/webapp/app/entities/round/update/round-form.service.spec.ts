import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../round.test-samples';

import { RoundFormService } from './round-form.service';

describe('Round Form Service', () => {
  let service: RoundFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundFormService);
  });

  describe('Service methods', () => {
    describe('createRoundFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRoundFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            linkedPrompt: expect.any(Object),
            linkedRoom: expect.any(Object),
            roundNumber: expect.any(Object),
            roundPrompt: expect.any(Object),
          })
        );
      });

      it('passing IRound should create a new form with FormGroup', () => {
        const formGroup = service.createRoundFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            linkedPrompt: expect.any(Object),
            linkedRoom: expect.any(Object),
            roundNumber: expect.any(Object),
            roundPrompt: expect.any(Object),
          })
        );
      });
    });

    describe('getRound', () => {
      it('should return NewRound for default Round initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRoundFormGroup(sampleWithNewData);

        const round = service.getRound(formGroup) as any;

        expect(round).toMatchObject(sampleWithNewData);
      });

      it('should return NewRound for empty Round initial value', () => {
        const formGroup = service.createRoundFormGroup();

        const round = service.getRound(formGroup) as any;

        expect(round).toMatchObject({});
      });

      it('should return IRound', () => {
        const formGroup = service.createRoundFormGroup(sampleWithRequiredData);

        const round = service.getRound(formGroup) as any;

        expect(round).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRound should not enable id FormControl', () => {
        const formGroup = service.createRoundFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRound should disable id FormControl', () => {
        const formGroup = service.createRoundFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
