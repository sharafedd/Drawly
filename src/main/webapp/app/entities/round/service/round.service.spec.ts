import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRound } from '../round.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../round.test-samples';

import { RoundService } from './round.service';

const requireRestSample: IRound = {
  ...sampleWithRequiredData,
};

describe('Round Service', () => {
  let service: RoundService;
  let httpMock: HttpTestingController;
  let expectedResult: IRound | IRound[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RoundService);
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

    it('should create a Round', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const round = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(round).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Round', () => {
      const round = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(round).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Round', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Round', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Round', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRoundToCollectionIfMissing', () => {
      it('should add a Round to an empty array', () => {
        const round: IRound = sampleWithRequiredData;
        expectedResult = service.addRoundToCollectionIfMissing([], round);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(round);
      });

      it('should not add a Round to an array that contains it', () => {
        const round: IRound = sampleWithRequiredData;
        const roundCollection: IRound[] = [
          {
            ...round,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRoundToCollectionIfMissing(roundCollection, round);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Round to an array that doesn't contain it", () => {
        const round: IRound = sampleWithRequiredData;
        const roundCollection: IRound[] = [sampleWithPartialData];
        expectedResult = service.addRoundToCollectionIfMissing(roundCollection, round);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(round);
      });

      it('should add only unique Round to an array', () => {
        const roundArray: IRound[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const roundCollection: IRound[] = [sampleWithRequiredData];
        expectedResult = service.addRoundToCollectionIfMissing(roundCollection, ...roundArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const round: IRound = sampleWithRequiredData;
        const round2: IRound = sampleWithPartialData;
        expectedResult = service.addRoundToCollectionIfMissing([], round, round2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(round);
        expect(expectedResult).toContain(round2);
      });

      it('should accept null and undefined values', () => {
        const round: IRound = sampleWithRequiredData;
        expectedResult = service.addRoundToCollectionIfMissing([], null, round, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(round);
      });

      it('should return initial array if no Round is added', () => {
        const roundCollection: IRound[] = [sampleWithRequiredData];
        expectedResult = service.addRoundToCollectionIfMissing(roundCollection, undefined, null);
        expect(expectedResult).toEqual(roundCollection);
      });
    });

    describe('compareRound', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRound(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRound(entity1, entity2);
        const compareResult2 = service.compareRound(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRound(entity1, entity2);
        const compareResult2 = service.compareRound(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRound(entity1, entity2);
        const compareResult2 = service.compareRound(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
