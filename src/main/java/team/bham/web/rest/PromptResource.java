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
import team.bham.domain.Prompt;
import team.bham.repository.PromptRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Prompt}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PromptResource {

    private final Logger log = LoggerFactory.getLogger(PromptResource.class);

    private static final String ENTITY_NAME = "prompt";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PromptRepository promptRepository;

    public PromptResource(PromptRepository promptRepository) {
        this.promptRepository = promptRepository;
    }

    /**
     * {@code POST  /prompts} : Create a new prompt.
     *
     * @param prompt the prompt to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new prompt, or with status {@code 400 (Bad Request)} if the prompt has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/prompts")
    public ResponseEntity<Prompt> createPrompt(@RequestBody Prompt prompt) throws URISyntaxException {
        log.debug("REST request to save Prompt : {}", prompt);
        if (prompt.getId() != null) {
            throw new BadRequestAlertException("A new prompt cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Prompt result = promptRepository.save(prompt);
        return ResponseEntity
            .created(new URI("/api/prompts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /prompts/:id} : Updates an existing prompt.
     *
     * @param id the id of the prompt to save.
     * @param prompt the prompt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prompt,
     * or with status {@code 400 (Bad Request)} if the prompt is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prompt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/prompts/{id}")
    public ResponseEntity<Prompt> updatePrompt(@PathVariable(value = "id", required = false) final Long id, @RequestBody Prompt prompt)
        throws URISyntaxException {
        log.debug("REST request to update Prompt : {}, {}", id, prompt);
        if (prompt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prompt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!promptRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Prompt result = promptRepository.save(prompt);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, prompt.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /prompts/:id} : Partial updates given fields of an existing prompt, field will ignore if it is null
     *
     * @param id the id of the prompt to save.
     * @param prompt the prompt to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prompt,
     * or with status {@code 400 (Bad Request)} if the prompt is not valid,
     * or with status {@code 404 (Not Found)} if the prompt is not found,
     * or with status {@code 500 (Internal Server Error)} if the prompt couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/prompts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Prompt> partialUpdatePrompt(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Prompt prompt
    ) throws URISyntaxException {
        log.debug("REST request to partial update Prompt partially : {}, {}", id, prompt);
        if (prompt.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prompt.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!promptRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Prompt> result = promptRepository
            .findById(prompt.getId())
            .map(existingPrompt -> {
                if (prompt.getPromptID() != null) {
                    existingPrompt.setPromptID(prompt.getPromptID());
                }
                if (prompt.getPromptContent() != null) {
                    existingPrompt.setPromptContent(prompt.getPromptContent());
                }
                if (prompt.getPromptDeadline() != null) {
                    existingPrompt.setPromptDeadline(prompt.getPromptDeadline());
                }
                if (prompt.getParticipantsNum() != null) {
                    existingPrompt.setParticipantsNum(prompt.getParticipantsNum());
                }

                return existingPrompt;
            })
            .map(promptRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, prompt.getId().toString())
        );
    }

    /**
     * {@code GET  /prompts} : get all the prompts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of prompts in body.
     */
    @GetMapping("/prompts")
    public List<Prompt> getAllPrompts() {
        log.debug("REST request to get all Prompts");
        return promptRepository.findAll();
    }

    /**
     * {@code GET  /prompts/:id} : get the "id" prompt.
     *
     * @param id the id of the prompt to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the prompt, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/prompts/{id}")
    public ResponseEntity<Prompt> getPrompt(@PathVariable Long id) {
        log.debug("REST request to get Prompt : {}", id);
        Optional<Prompt> prompt = promptRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(prompt);
    }

    /**
     * {@code DELETE  /prompts/:id} : delete the "id" prompt.
     *
     * @param id the id of the prompt to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/prompts/{id}")
    public ResponseEntity<Void> deletePrompt(@PathVariable Long id) {
        log.debug("REST request to delete Prompt : {}", id);
        promptRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
