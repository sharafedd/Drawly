import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompetition } from '../competition.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../competition.test-samples';

import { CompetitionService } from './competition.service';

const requireRestSample: ICompetition = {
  ...sampleWithRequiredData,
};

describe('Competition Service', () => {
  let service: CompetitionService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompetition | ICompetition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompetitionService);
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

    it('should create a Competition', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const competition = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(competition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Competition', () => {
      const competition = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(competition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Competition', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Competition', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Competition', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompetitionToCollectionIfMissing', () => {
      it('should add a Competition to an empty array', () => {
        const competition: ICompetition = sampleWithRequiredData;
        expectedResult = service.addCompetitionToCollectionIfMissing([], competition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(competition);
      });

      it('should not add a Competition to an array that contains it', () => {
        const competition: ICompetition = sampleWithRequiredData;
        const competitionCollection: ICompetition[] = [
          {
            ...competition,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompetitionToCollectionIfMissing(competitionCollection, competition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Competition to an array that doesn't contain it", () => {
        const competition: ICompetition = sampleWithRequiredData;
        const competitionCollection: ICompetition[] = [sampleWithPartialData];
        expectedResult = service.addCompetitionToCollectionIfMissing(competitionCollection, competition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(competition);
      });

      it('should add only unique Competition to an array', () => {
        const competitionArray: ICompetition[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const competitionCollection: ICompetition[] = [sampleWithRequiredData];
        expectedResult = service.addCompetitionToCollectionIfMissing(competitionCollection, ...competitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const competition: ICompetition = sampleWithRequiredData;
        const competition2: ICompetition = sampleWithPartialData;
        expectedResult = service.addCompetitionToCollectionIfMissing([], competition, competition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(competition);
        expect(expectedResult).toContain(competition2);
      });

      it('should accept null and undefined values', () => {
        const competition: ICompetition = sampleWithRequiredData;
        expectedResult = service.addCompetitionToCollectionIfMissing([], null, competition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(competition);
      });

      it('should return initial array if no Competition is added', () => {
        const competitionCollection: ICompetition[] = [sampleWithRequiredData];
        expectedResult = service.addCompetitionToCollectionIfMissing(competitionCollection, undefined, null);
        expect(expectedResult).toEqual(competitionCollection);
      });
    });

    describe('compareCompetition', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompetition(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompetition(entity1, entity2);
        const compareResult2 = service.compareCompetition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompetition(entity1, entity2);
        const compareResult2 = service.compareCompetition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompetition(entity1, entity2);
        const compareResult2 = service.compareCompetition(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
