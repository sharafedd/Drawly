import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RoomFormService } from './room-form.service';
import { RoomService } from '../service/room.service';
import { IRoom } from '../room.model';
import { IPlayer } from 'app/entities/player/player.model';
import { PlayerService } from 'app/entities/player/service/player.service';
import { IRound } from 'app/entities/round/round.model';
import { RoundService } from 'app/entities/round/service/round.service';
import { IRoundPrompt } from 'app/entities/round-prompt/round-prompt.model';
import { RoundPromptService } from 'app/entities/round-prompt/service/round-prompt.service';

import { RoomUpdateComponent } from './room-update.component';

describe('Room Management Update Component', () => {
  let comp: RoomUpdateComponent;
  let fixture: ComponentFixture<RoomUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let roomFormService: RoomFormService;
  let roomService: RoomService;
  let playerService: PlayerService;
  let roundService: RoundService;
  let roundPromptService: RoundPromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RoomUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RoomUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoomUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    roomFormService = TestBed.inject(RoomFormService);
    roomService = TestBed.inject(RoomService);
    playerService = TestBed.inject(PlayerService);
    roundService = TestBed.inject(RoundService);
    roundPromptService = TestBed.inject(RoundPromptService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Player query and add missing value', () => {
      const room: IRoom = { id: 456 };
      const player: IPlayer = { id: 21603 };
      room.player = player;

      const playerCollection: IPlayer[] = [{ id: 48630 }];
      jest.spyOn(playerService, 'query').mockReturnValue(of(new HttpResponse({ body: playerCollection })));
      const additionalPlayers = [player];
      const expectedCollection: IPlayer[] = [...additionalPlayers, ...playerCollection];
      jest.spyOn(playerService, 'addPlayerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ room });
      comp.ngOnInit();

      expect(playerService.query).toHaveBeenCalled();
      expect(playerService.addPlayerToCollectionIfMissing).toHaveBeenCalledWith(
        playerCollection,
        ...additionalPlayers.map(expect.objectContaining)
      );
      expect(comp.playersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Round query and add missing value', () => {
      const room: IRoom = { id: 456 };
      const round: IRound = { id: 12783 };
      room.round = round;

      const roundCollection: IRound[] = [{ id: 1175 }];
      jest.spyOn(roundService, 'query').mockReturnValue(of(new HttpResponse({ body: roundCollection })));
      const additionalRounds = [round];
      const expectedCollection: IRound[] = [...additionalRounds, ...roundCollection];
      jest.spyOn(roundService, 'addRoundToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ room });
      comp.ngOnInit();

      expect(roundService.query).toHaveBeenCalled();
      expect(roundService.addRoundToCollectionIfMissing).toHaveBeenCalledWith(
        roundCollection,
        ...additionalRounds.map(expect.objectContaining)
      );
      expect(comp.roundsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call RoundPrompt query and add missing value', () => {
      const room: IRoom = { id: 456 };
      const roundPrompt: IRoundPrompt = { id: 27368 };
      room.roundPrompt = roundPrompt;

      const roundPromptCollection: IRoundPrompt[] = [{ id: 54232 }];
      jest.spyOn(roundPromptService, 'query').mockReturnValue(of(new HttpResponse({ body: roundPromptCollection })));
      const additionalRoundPrompts = [roundPrompt];
      const expectedCollection: IRoundPrompt[] = [...additionalRoundPrompts, ...roundPromptCollection];
      jest.spyOn(roundPromptService, 'addRoundPromptToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ room });
      comp.ngOnInit();

      expect(roundPromptService.query).toHaveBeenCalled();
      expect(roundPromptService.addRoundPromptToCollectionIfMissing).toHaveBeenCalledWith(
        roundPromptCollection,
        ...additionalRoundPrompts.map(expect.objectContaining)
      );
      expect(comp.roundPromptsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const room: IRoom = { id: 456 };
      const player: IPlayer = { id: 84951 };
      room.player = player;
      const round: IRound = { id: 28426 };
      room.round = round;
      const roundPrompt: IRoundPrompt = { id: 68493 };
      room.roundPrompt = roundPrompt;

      activatedRoute.data = of({ room });
      comp.ngOnInit();

      expect(comp.playersSharedCollection).toContain(player);
      expect(comp.roundsSharedCollection).toContain(round);
      expect(comp.roundPromptsSharedCollection).toContain(roundPrompt);
      expect(comp.room).toEqual(room);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoom>>();
      const room = { id: 123 };
      jest.spyOn(roomFormService, 'getRoom').mockReturnValue(room);
      jest.spyOn(roomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ room });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: room }));
      saveSubject.complete();

      // THEN
      expect(roomFormService.getRoom).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(roomService.update).toHaveBeenCalledWith(expect.objectContaining(room));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoom>>();
      const room = { id: 123 };
      jest.spyOn(roomFormService, 'getRoom').mockReturnValue({ id: null });
      jest.spyOn(roomService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ room: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: room }));
      saveSubject.complete();

      // THEN
      expect(roomFormService.getRoom).toHaveBeenCalled();
      expect(roomService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoom>>();
      const room = { id: 123 };
      jest.spyOn(roomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ room });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(roomService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePlayer', () => {
      it('Should forward to playerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(playerService, 'comparePlayer');
        comp.comparePlayer(entity, entity2);
        expect(playerService.comparePlayer).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareRound', () => {
      it('Should forward to roundService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(roundService, 'compareRound');
        comp.compareRound(entity, entity2);
        expect(roundService.compareRound).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareRoundPrompt', () => {
      it('Should forward to roundPromptService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(roundPromptService, 'compareRoundPrompt');
        comp.compareRoundPrompt(entity, entity2);
        expect(roundPromptService.compareRoundPrompt).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
