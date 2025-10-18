import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlayer } from '../player.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../player.test-samples';

import { PlayerService } from './player.service';

const requireRestSample: IPlayer = {
  ...sampleWithRequiredData,
};

describe('Player Service', () => {
  let service: PlayerService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlayer | IPlayer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlayerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Player', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const player = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(player).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Player', () => {
      const player = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(player).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Player', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Player', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Player', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlayerToCollectionIfMissing', () => {
      it('should add a Player to an empty array', () => {
        const player: IPlayer = sampleWithRequiredData;
        expectedResult = service.addPlayerToCollectionIfMissing([], player);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(player);
      });

      it('should not add a Player to an array that contains it', () => {
        const player: IPlayer = sampleWithRequiredData;
        const playerCollection: IPlayer[] = [
          {
            ...player,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlayerToCollectionIfMissing(playerCollection, player);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Player to an array that doesn't contain it", () => {
        const player: IPlayer = sampleWithRequiredData;
        const playerCollection: IPlayer[] = [sampleWithPartialData];
        expectedResult = service.addPlayerToCollectionIfMissing(playerCollection, player);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(player);
      });

      it('should add only unique Player to an array', () => {
        const playerArray: IPlayer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const playerCollection: IPlayer[] = [sampleWithRequiredData];
        expectedResult = service.addPlayerToCollectionIfMissing(playerCollection, ...playerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const player: IPlayer = sampleWithRequiredData;
        const player2: IPlayer = sampleWithPartialData;
        expectedResult = service.addPlayerToCollectionIfMissing([], player, player2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(player);
        expect(expectedResult).toContain(player2);
      });

      it('should accept null and undefined values', () => {
        const player: IPlayer = sampleWithRequiredData;
        expectedResult = service.addPlayerToCollectionIfMissing([], null, player, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(player);
      });

      it('should return initial array if no Player is added', () => {
        const playerCollection: IPlayer[] = [sampleWithRequiredData];
        expectedResult = service.addPlayerToCollectionIfMissing(playerCollection, undefined, null);
        expect(expectedResult).toEqual(playerCollection);
      });
    });

    describe('comparePlayer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlayer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlayer(entity1, entity2);
        const compareResult2 = service.comparePlayer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlayer(entity1, entity2);
        const compareResult2 = service.comparePlayer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlayer(entity1, entity2);
        const compareResult2 = service.comparePlayer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
