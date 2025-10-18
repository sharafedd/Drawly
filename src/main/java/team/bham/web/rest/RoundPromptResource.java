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
import team.bham.domain.RoundPrompt;
import team.bham.repository.RoundPromptRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.RoundPrompt}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RoundPromptResource {

    private final Logger log = LoggerFactory.getLogger(RoundPromptResource.class);

    private static final String ENTITY_NAME = "roundPrompt";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RoundPromptRepository roundPromptRepository;

    public RoundPromptResource(RoundPromptRepository roundPromptRepository) {
        this.roundPromptRepository = roundPromptRepository;
    }

    /**
     * {@code POST  /round-prompts} : Create a new roundPrompt.
     *
     * @param roundPrompt the roundPrompt to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new roundPrompt, or with status {@code 400 (Bad Request)} if the roundPrompt has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/round-prompts")
    public ResponseEntity<RoundPrompt> createRoundPrompt(@RequestBody RoundPrompt roundPrompt) throws URISyntaxException {
        log.debug("REST request to save RoundPrompt : {}", roundPrompt);
        if (roundPrompt.getId() != null) {
            throw new BadRequestAlertException("A new roundPrompt cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RoundPrompt result = roundPromptRepository.save(roundPrompt);
        return ResponseEntity
            .created(new URI("/api/round-prompts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /round-prompts/:id} : Updates an existing roundPrompt.
     *
     * @param id the id of the roundPrompt to save.
     * @param roundPrompt the roundPrompt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated roundPrompt,
     * or with status {@code 400 (Bad Request)} if the roundPrompt is not valid,
     * or with status {@code 500 (Internal Server Error)} if the roundPrompt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/round-prompts/{id}")
    public ResponseEntity<RoundPrompt> updateRoundPrompt(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RoundPrompt roundPrompt
    ) throws URISyntaxException {
        log.debug("REST request to update RoundPrompt : {}, {}", id, roundPrompt);
        if (roundPrompt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roundPrompt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roundPromptRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RoundPrompt result = roundPromptRepository.save(roundPrompt);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, roundPrompt.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /round-prompts/:id} : Partial updates given fields of an existing roundPrompt, field will ignore if it is null
     *
     * @param id the id of the roundPrompt to save.
     * @param roundPrompt the roundPrompt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated roundPrompt,
     * or with status {@code 400 (Bad Request)} if the roundPrompt is not valid,
     * or with status {@code 404 (Not Found)} if the roundPrompt is not found,
     * or with status {@code 500 (Internal Server Error)} if the roundPrompt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/round-prompts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RoundPrompt> partialUpdateRoundPrompt(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RoundPrompt roundPrompt
    ) throws URISyntaxException {
        log.debug("REST request to partial update RoundPrompt partially : {}, {}", id, roundPrompt);
        if (roundPrompt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roundPrompt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roundPromptRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RoundPrompt> result = roundPromptRepository
            .findById(roundPrompt.getId())
            .map(existingRoundPrompt -> {
                if (roundPrompt.getLinkedRoom() != null) {
                    existingRoundPrompt.setLinkedRoom(roundPrompt.getLinkedRoom());
                }
                if (roundPrompt.getLinkedRound() != null) {
                    existingRoundPrompt.setLinkedRound(roundPrompt.getLinkedRound());
                }
                if (roundPrompt.getContent() != null) {
                    existingRoundPrompt.setContent(roundPrompt.getContent());
                }

                return existingRoundPrompt;
            })
            .map(roundPromptRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, roundPrompt.getId().toString())
        );
    }

    /**
     * {@code GET  /round-prompts} : get all the roundPrompts.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of roundPrompts in body.
     */
    @GetMapping("/round-prompts")
    public List<RoundPrompt> getAllRoundPrompts(@RequestParam(required = false) String filter) {
        if ("round-is-null".equals(filter)) {
            log.debug("REST request to get all RoundPrompts where round is null");
            return StreamSupport
                .stream(roundPromptRepository.findAll().spliterator(), false)
                .filter(roundPrompt -> roundPrompt.getRound() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all RoundPrompts");
        return roundPromptRepository.findAll();
    }

    /**
     * {@code GET  /round-prompts/:id} : get the "id" roundPrompt.
     *
     * @param id the id of the roundPrompt to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the roundPrompt, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/round-prompts/{id}")
    public ResponseEntity<RoundPrompt> getRoundPrompt(@PathVariable Long id) {
        log.debug("REST request to get RoundPrompt : {}", id);
        Optional<RoundPrompt> roundPrompt = roundPromptRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(roundPrompt);
    }

    /**
     * {@code DELETE  /round-prompts/:id} : delete the "id" roundPrompt.
     *
     * @param id the id of the roundPrompt to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/round-prompts/{id}")
    public ResponseEntity<Void> deleteRoundPrompt(@PathVariable Long id) {
        log.debug("REST request to delete RoundPrompt : {}", id);
        roundPromptRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
