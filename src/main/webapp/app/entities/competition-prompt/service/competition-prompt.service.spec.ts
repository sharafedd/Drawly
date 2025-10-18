import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompetitionPrompt } from '../competition-prompt.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../competition-prompt.test-samples';

import { CompetitionPromptService } from './competition-prompt.service';

const requireRestSample: ICompetitionPrompt = {
  ...sampleWithRequiredData,
};

describe('CompetitionPrompt Service', () => {
  let service: CompetitionPromptService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompetitionPrompt | ICompetitionPrompt[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompetitionPromptService);
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

    it('should create a CompetitionPrompt', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const competitionPrompt = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(competitionPrompt).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompetitionPrompt', () => {
      const competitionPrompt = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(competitionPrompt).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompetitionPrompt', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompetitionPrompt', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompetitionPrompt', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompetitionPromptToCollectionIfMissing', () => {
      it('should add a CompetitionPrompt to an empty array', () => {
        const competitionPrompt: ICompetitionPrompt = sampleWithRequiredData;
        expectedResult = service.addCompetitionPromptToCollectionIfMissing([], competitionPrompt);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(competitionPrompt);
      });

      it('should not add a CompetitionPrompt to an array that contains it', () => {
        const competitionPrompt: ICompetitionPrompt = sampleWithRequiredData;
        const competitionPromptCollection: ICompetitionPrompt[] = [
          {
            ...competitionPrompt,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompetitionPromptToCollectionIfMissing(competitionPromptCollection, competitionPrompt);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompetitionPrompt to an array that doesn't contain it", () => {
        const competitionPrompt: ICompetitionPrompt = sampleWithRequiredData;
        const competitionPromptCollection: ICompetitionPrompt[] = [sampleWithPartialData];
        expectedResult = service.addCompetitionPromptToCollectionIfMissing(competitionPromptCollection, competitionPrompt);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(competitionPrompt);
      });

      it('should add only unique CompetitionPrompt to an array', () => {
        const competitionPromptArray: ICompetitionPrompt[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const competitionPromptCollection: ICompetitionPrompt[] = [sampleWithRequiredData];
        expectedResult = service.addCompetitionPromptToCollectionIfMissing(competitionPromptCollection, ...competitionPromptArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const competitionPrompt: ICompetitionPrompt = sampleWithRequiredData;
        const competitionPrompt2: ICompetitionPrompt = sampleWithPartialData;
        expectedResult = service.addCompetitionPromptToCollectionIfMissing([], competitionPrompt, competitionPrompt2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(competitionPrompt);
        expect(expectedResult).toContain(competitionPrompt2);
      });

      it('should accept null and undefined values', () => {
        const competitionPrompt: ICompetitionPrompt = sampleWithRequiredData;
        expectedResult = service.addCompetitionPromptToCollectionIfMissing([], null, competitionPrompt, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(competitionPrompt);
      });

      it('should return initial array if no CompetitionPrompt is added', () => {
        const competitionPromptCollection: ICompetitionPrompt[] = [sampleWithRequiredData];
        expectedResult = service.addCompetitionPromptToCollectionIfMissing(competitionPromptCollection, undefined, null);
        expect(expectedResult).toEqual(competitionPromptCollection);
      });
    });

    describe('compareCompetitionPrompt', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompetitionPrompt(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompetitionPrompt(entity1, entity2);
        const compareResult2 = service.compareCompetitionPrompt(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompetitionPrompt(entity1, entity2);
        const compareResult2 = service.compareCompetitionPrompt(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompetitionPrompt(entity1, entity2);
        const compareResult2 = service.compareCompetitionPrompt(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
