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
import team.bham.domain.Competition;
import team.bham.repository.CompetitionRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Competition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompetitionResource {

    private final Logger log = LoggerFactory.getLogger(CompetitionResource.class);

    private static final String ENTITY_NAME = "competition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompetitionRepository competitionRepository;

    public CompetitionResource(CompetitionRepository competitionRepository) {
        this.competitionRepository = competitionRepository;
    }

    /**
     * {@code POST  /competitions} : Create a new competition.
     *
     * @param competition the competition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new competition, or with status {@code 400 (Bad Request)} if the competition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/competitions")
    public ResponseEntity<Competition> createCompetition(@RequestBody Competition competition) throws URISyntaxException {
        log.debug("REST request to save Competition : {}", competition);
        if (competition.getId() != null) {
            throw new BadRequestAlertException("A new competition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Competition result = competitionRepository.save(competition);
        return ResponseEntity
            .created(new URI("/api/competitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /competitions/:id} : Updates an existing competition.
     *
     * @param id the id of the competition to save.
     * @param competition the competition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated competition,
     * or with status {@code 400 (Bad Request)} if the competition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the competition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/competitions/{id}")
    public ResponseEntity<Competition> updateCompetition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Competition competition
    ) throws URISyntaxException {
        log.debug("REST request to update Competition : {}, {}", id, competition);
        if (competition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, competition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!competitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Competition result = competitionRepository.save(competition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, competition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /competitions/:id} : Partial updates given fields of an existing competition, field will ignore if it is null
     *
     * @param id the id of the competition to save.
     * @param competition the competition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated competition,
     * or with status {@code 400 (Bad Request)} if the competition is not valid,
     * or with status {@code 404 (Not Found)} if the competition is not found,
     * or with status {@code 500 (Internal Server Error)} if the competition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/competitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Competition> partialUpdateCompetition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Competition competition
    ) throws URISyntaxException {
        log.debug("REST request to partial update Competition partially : {}, {}", id, competition);
        if (competition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, competition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!competitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Competition> result = competitionRepository
            .findById(competition.getId())
            .map(existingCompetition -> {
                if (competition.getCompType() != null) {
                    existingCompetition.setCompType(competition.getCompType());
                }
                if (competition.getTotalParticipants() != null) {
                    existingCompetition.setTotalParticipants(competition.getTotalParticipants());
                }

                return existingCompetition;
            })
            .map(competitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, competition.getId().toString())
        );
    }

    /**
     * {@code GET  /competitions} : get all the competitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of competitions in body.
     */
    @GetMapping("/competitions")
    public List<Competition> getAllCompetitions() {
        log.debug("REST request to get all Competitions");
        return competitionRepository.findAll();
    }

    /**
     * {@code GET  /competitions/:id} : get the "id" competition.
     *
     * @param id the id of the competition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the competition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/competitions/{id}")
    public ResponseEntity<Competition> getCompetition(@PathVariable Long id) {
        log.debug("REST request to get Competition : {}", id);
        Optional<Competition> competition = competitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(competition);
    }

    /**
     * {@code DELETE  /competitions/:id} : delete the "id" competition.
     *
     * @param id the id of the competition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/competitions/{id}")
    public ResponseEntity<Void> deleteCompetition(@PathVariable Long id) {
        log.debug("REST request to delete Competition : {}", id);
        competitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
