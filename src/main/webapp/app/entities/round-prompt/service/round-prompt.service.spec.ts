import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRoundPrompt } from '../round-prompt.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../round-prompt.test-samples';

import { RoundPromptService } from './round-prompt.service';

const requireRestSample: IRoundPrompt = {
  ...sampleWithRequiredData,
};

describe('RoundPrompt Service', () => {
  let service: RoundPromptService;
  let httpMock: HttpTestingController;
  let expectedResult: IRoundPrompt | IRoundPrompt[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RoundPromptService);
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

    it('should create a RoundPrompt', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const roundPrompt = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(roundPrompt).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RoundPrompt', () => {
      const roundPrompt = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(roundPrompt).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RoundPrompt', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RoundPrompt', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RoundPrompt', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRoundPromptToCollectionIfMissing', () => {
      it('should add a RoundPrompt to an empty array', () => {
        const roundPrompt: IRoundPrompt = sampleWithRequiredData;
        expectedResult = service.addRoundPromptToCollectionIfMissing([], roundPrompt);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(roundPrompt);
      });

      it('should not add a RoundPrompt to an array that contains it', () => {
        const roundPrompt: IRoundPrompt = sampleWithRequiredData;
        const roundPromptCollection: IRoundPrompt[] = [
          {
            ...roundPrompt,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRoundPromptToCollectionIfMissing(roundPromptCollection, roundPrompt);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RoundPrompt to an array that doesn't contain it", () => {
        const roundPrompt: IRoundPrompt = sampleWithRequiredData;
        const roundPromptCollection: IRoundPrompt[] = [sampleWithPartialData];
        expectedResult = service.addRoundPromptToCollectionIfMissing(roundPromptCollection, roundPrompt);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(roundPrompt);
      });

      it('should add only unique RoundPrompt to an array', () => {
        const roundPromptArray: IRoundPrompt[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const roundPromptCollection: IRoundPrompt[] = [sampleWithRequiredData];
        expectedResult = service.addRoundPromptToCollectionIfMissing(roundPromptCollection, ...roundPromptArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const roundPrompt: IRoundPrompt = sampleWithRequiredData;
        const roundPrompt2: IRoundPrompt = sampleWithPartialData;
        expectedResult = service.addRoundPromptToCollectionIfMissing([], roundPrompt, roundPrompt2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(roundPrompt);
        expect(expectedResult).toContain(roundPrompt2);
      });

      it('should accept null and undefined values', () => {
        const roundPrompt: IRoundPrompt = sampleWithRequiredData;
        expectedResult = service.addRoundPromptToCollectionIfMissing([], null, roundPrompt, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(roundPrompt);
      });

      it('should return initial array if no RoundPrompt is added', () => {
        const roundPromptCollection: IRoundPrompt[] = [sampleWithRequiredData];
        expectedResult = service.addRoundPromptToCollectionIfMissing(roundPromptCollection, undefined, null);
        expect(expectedResult).toEqual(roundPromptCollection);
      });
    });

    describe('compareRoundPrompt', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRoundPrompt(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRoundPrompt(entity1, entity2);
        const compareResult2 = service.compareRoundPrompt(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRoundPrompt(entity1, entity2);
        const compareResult2 = service.compareRoundPrompt(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRoundPrompt(entity1, entity2);
        const compareResult2 = service.compareRoundPrompt(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
