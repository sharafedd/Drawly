package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Round;
import team.bham.repository.RoundRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Round}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RoundResource {

    private final Logger log = LoggerFactory.getLogger(RoundResource.class);

    private static final String ENTITY_NAME = "round";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RoundRepository roundRepository;

    public RoundResource(RoundRepository roundRepository) {
        this.roundRepository = roundRepository;
    }

    /**
     * {@code POST  /rounds} : Create a new round.
     *
     * @param round the round to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new round, or with status {@code 400 (Bad Request)} if the round has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rounds")
    public ResponseEntity<Round> createRound(@RequestBody Round round) throws URISyntaxException {
        log.debug("REST request to save Round : {}", round);
        if (round.getId() != null) {
            throw new BadRequestAlertException("A new round cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Round result = roundRepository.save(round);
        return ResponseEntity
            .created(new URI("/api/rounds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rounds/:id} : Updates an existing round.
     *
     * @param id the id of the round to save.
     * @param round the round to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated round,
     * or with status {@code 400 (Bad Request)} if the round is not valid,
     * or with status {@code 500 (Internal Server Error)} if the round couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rounds/{id}")
    public ResponseEntity<Round> updateRound(@PathVariable(value = "id", required = false) final Long id, @RequestBody Round round)
        throws URISyntaxException {
        log.debug("REST request to update Round : {}, {}", id, round);
        if (round.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, round.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roundRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Round result = roundRepository.save(round);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, round.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rounds/:id} : Partial updates given fields of an existing round, field will ignore if it is null
     *
     * @param id the id of the round to save.
     * @param round the round to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated round,
     * or with status {@code 400 (Bad Request)} if the round is not valid,
     * or with status {@code 404 (Not Found)} if the round is not found,
     * or with status {@code 500 (Internal Server Error)} if the round couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rounds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Round> partialUpdateRound(@PathVariable(value = "id", required = false) final Long id, @RequestBody Round round)
        throws URISyntaxException {
        log.debug("REST request to partial update Round partially : {}, {}", id, round);
        if (round.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, round.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roundRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Round> result = roundRepository
            .findById(round.getId())
            .map(existingRound -> {
                if (round.getLinkedPrompt() != null) {
                    existingRound.setLinkedPrompt(round.getLinkedPrompt());
                }
                if (round.getLinkedRoom() != null) {
                    existingRound.setLinkedRoom(round.getLinkedRoom());
                }
                if (round.getRoundNumber() != null) {
                    existingRound.setRoundNumber(round.getRoundNumber());
                }

                return existingRound;
            })
            .map(roundRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, round.getId().toString())
        );
    }

    /**
     * {@code GET  /rounds} : get all the rounds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rounds in body.
     */
    @GetMapping("/rounds")
    public List<Round> getAllRounds() {
        log.debug("REST request to get all Rounds");
        return roundRepository.findAll();
    }

    /**
     * {@code GET  /rounds/:id} : get the "id" round.
     *
     * @param id the id of the round to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the round, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rounds/{id}")
    public ResponseEntity<Round> getRound(@PathVariable Long id) {
        log.debug("REST request to get Round : {}", id);
        Optional<Round> round = roundRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(round);
    }

    /**
     * {@code DELETE  /rounds/:id} : delete the "id" round.
     *
     * @param id the id of the round to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rounds/{id}")
    public ResponseEntity<Void> deleteRound(@PathVariable Long id) {
        log.debug("REST request to delete Round : {}", id);
        roundRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
