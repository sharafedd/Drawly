import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../player.test-samples';

import { PlayerFormService } from './player-form.service';

describe('Player Form Service', () => {
  let service: PlayerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerFormService);
  });

  describe('Service methods', () => {
    describe('createPlayerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlayerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            linkedUser: expect.any(Object),
            linkedRoom: expect.any(Object),
            username: expect.any(Object),
            drawing: expect.any(Object),
            totalStars: expect.any(Object),
            rank: expect.any(Object),
          })
        );
      });

      it('passing IPlayer should create a new form with FormGroup', () => {
        const formGroup = service.createPlayerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            linkedUser: expect.any(Object),
            linkedRoom: expect.any(Object),
            username: expect.any(Object),
            drawing: expect.any(Object),
            totalStars: expect.any(Object),
            rank: expect.any(Object),
          })
        );
      });
    });

    describe('getPlayer', () => {
      it('should return NewPlayer for default Player initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPlayerFormGroup(sampleWithNewData);

        const player = service.getPlayer(formGroup) as any;

        expect(player).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlayer for empty Player initial value', () => {
        const formGroup = service.createPlayerFormGroup();

        const player = service.getPlayer(formGroup) as any;

        expect(player).toMatchObject({});
      });

      it('should return IPlayer', () => {
        const formGroup = service.createPlayerFormGroup(sampleWithRequiredData);

        const player = service.getPlayer(formGroup) as any;

        expect(player).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlayer should not enable id FormControl', () => {
        const formGroup = service.createPlayerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlayer should disable id FormControl', () => {
        const formGroup = service.createPlayerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
