package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.CompetitionPrompt;
import team.bham.repository.CompetitionPromptRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CompetitionPrompt}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompetitionPromptResource {

    private final Logger log = LoggerFactory.getLogger(CompetitionPromptResource.class);

    private static final String ENTITY_NAME = "competitionPrompt";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompetitionPromptRepository competitionPromptRepository;

    public CompetitionPromptResource(CompetitionPromptRepository competitionPromptRepository) {
        this.competitionPromptRepository = competitionPromptRepository;
    }

    /**
     * {@code POST  /competition-prompts} : Create a new competitionPrompt.
     *
     * @param competitionPrompt the competitionPrompt to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new competitionPrompt, or with status {@code 400 (Bad Request)} if the competitionPrompt has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/competition-prompts")
    public ResponseEntity<CompetitionPrompt> createCompetitionPrompt(@RequestBody CompetitionPrompt competitionPrompt)
        throws URISyntaxException {
        log.debug("REST request to save CompetitionPrompt : {}", competitionPrompt);
        if (competitionPrompt.getId() != null) {
            throw new BadRequestAlertException("A new competitionPrompt cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompetitionPrompt result = competitionPromptRepository.save(competitionPrompt);
        return ResponseEntity
            .created(new URI("/api/competition-prompts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /competition-prompts/:id} : Updates an existing competitionPrompt.
     *
     * @param id the id of the competitionPrompt to save.
     * @param competitionPrompt the competitionPrompt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated competitionPrompt,
     * or with status {@code 400 (Bad Request)} if the competitionPrompt is not valid,
     * or with status {@code 500 (Internal Server Error)} if the competitionPrompt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/competition-prompts/{id}")
    public ResponseEntity<CompetitionPrompt> updateCompetitionPrompt(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompetitionPrompt competitionPrompt
    ) throws URISyntaxException {
        log.debug("REST request to update CompetitionPrompt : {}, {}", id, competitionPrompt);
        if (competitionPrompt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, competitionPrompt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!competitionPromptRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompetitionPrompt result = competitionPromptRepository.save(competitionPrompt);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, competitionPrompt.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /competition-prompts/:id} : Partial updates given fields of an existing competitionPrompt, field will ignore if it is null
     *
     * @param id the id of the competitionPrompt to save.
     * @param competitionPrompt the competitionPrompt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated competitionPrompt,
     * or with status {@code 400 (Bad Request)} if the competitionPrompt is not valid,
     * or with status {@code 404 (Not Found)} if the competitionPrompt is not found,
     * or with status {@code 500 (Internal Server Error)} if the competitionPrompt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/competition-prompts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompetitionPrompt> partialUpdateCompetitionPrompt(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompetitionPrompt competitionPrompt
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompetitionPrompt partially : {}, {}", id, competitionPrompt);
        if (competitionPrompt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, competitionPrompt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!competitionPromptRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompetitionPrompt> result = competitionPromptRepository
            .findById(competitionPrompt.getId())
            .map(existingCompetitionPrompt -> {
                if (competitionPrompt.getLinkedCompetition() != null) {
                    existingCompetitionPrompt.setLinkedCompetition(competitionPrompt.getLinkedCompetition());
                }
                if (competitionPrompt.getPromptContent() != null) {
                    existingCompetitionPrompt.setPromptContent(competitionPrompt.getPromptContent());
                }

                return existingCompetitionPrompt;
            })
            .map(competitionPromptRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, competitionPrompt.getId().toString())
        );
    }

    /**
     * {@code GET  /competition-prompts} : get all the competitionPrompts.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of competitionPrompts in body.
     */
    @GetMapping("/competition-prompts")
    public List<CompetitionPrompt> getAllCompetitionPrompts(@RequestParam(required = false) String filter) {
        if ("competition-is-null".equals(filter)) {
            log.debug("REST request to get all CompetitionPrompts where competition is null");
            return StreamSupport
                .stream(competitionPromptRepository.findAll().spliterator(), false)
                .filter(competitionPrompt -> competitionPrompt.getCompetition() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all CompetitionPrompts");
        return competitionPromptRepository.findAll();
    }

    /**
     * {@code GET  /competition-prompts/:id} : get the "id" competitionPrompt.
     *
     * @param id the id of the competitionPrompt to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the competitionPrompt, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/competition-prompts/{id}")
    public ResponseEntity<CompetitionPrompt> getCompetitionPrompt(@PathVariable Long id) {
        log.debug("REST request to get CompetitionPrompt : {}", id);
        Optional<CompetitionPrompt> competitionPrompt = competitionPromptRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(competitionPrompt);
    }

    /**
     * {@code DELETE  /competition-prompts/:id} : delete the "id" competitionPrompt.
     *
     * @param id the id of the competitionPrompt to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/competition-prompts/{id}")
    public ResponseEntity<Void> deleteCompetitionPrompt(@PathVariable Long id) {
        log.debug("REST request to delete CompetitionPrompt : {}", id);
        competitionPromptRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
