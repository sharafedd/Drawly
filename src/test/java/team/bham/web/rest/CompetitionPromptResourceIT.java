package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.CompetitionPrompt;
import team.bham.repository.CompetitionPromptRepository;

/**
 * Integration tests for the {@link CompetitionPromptResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompetitionPromptResourceIT {

    private static final Long DEFAULT_LINKED_COMPETITION = 1L;
    private static final Long UPDATED_LINKED_COMPETITION = 2L;

    private static final String DEFAULT_PROMPT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_PROMPT_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/competition-prompts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompetitionPromptRepository competitionPromptRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompetitionPromptMockMvc;

    private CompetitionPrompt competitionPrompt;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompetitionPrompt createEntity(EntityManager em) {
        CompetitionPrompt competitionPrompt = new CompetitionPrompt()
            .linkedCompetition(DEFAULT_LINKED_COMPETITION)
            .promptContent(DEFAULT_PROMPT_CONTENT);
        return competitionPrompt;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompetitionPrompt createUpdatedEntity(EntityManager em) {
        CompetitionPrompt competitionPrompt = new CompetitionPrompt()
            .linkedCompetition(UPDATED_LINKED_COMPETITION)
            .promptContent(UPDATED_PROMPT_CONTENT);
        return competitionPrompt;
    }

    @BeforeEach
    public void initTest() {
        competitionPrompt = createEntity(em);
    }

    @Test
    @Transactional
    void createCompetitionPrompt() throws Exception {
        int databaseSizeBeforeCreate = competitionPromptRepository.findAll().size();
        // Create the CompetitionPrompt
        restCompetitionPromptMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(competitionPrompt))
            )
            .andExpect(status().isCreated());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeCreate + 1);
        CompetitionPrompt testCompetitionPrompt = competitionPromptList.get(competitionPromptList.size() - 1);
        assertThat(testCompetitionPrompt.getLinkedCompetition()).isEqualTo(DEFAULT_LINKED_COMPETITION);
        assertThat(testCompetitionPrompt.getPromptContent()).isEqualTo(DEFAULT_PROMPT_CONTENT);
    }

    @Test
    @Transactional
    void createCompetitionPromptWithExistingId() throws Exception {
        // Create the CompetitionPrompt with an existing ID
        competitionPrompt.setId(1L);

        int databaseSizeBeforeCreate = competitionPromptRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompetitionPromptMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(competitionPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompetitionPrompts() throws Exception {
        // Initialize the database
        competitionPromptRepository.saveAndFlush(competitionPrompt);

        // Get all the competitionPromptList
        restCompetitionPromptMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(competitionPrompt.getId().intValue())))
            .andExpect(jsonPath("$.[*].linkedCompetition").value(hasItem(DEFAULT_LINKED_COMPETITION.intValue())))
            .andExpect(jsonPath("$.[*].promptContent").value(hasItem(DEFAULT_PROMPT_CONTENT)));
    }

    @Test
    @Transactional
    void getCompetitionPrompt() throws Exception {
        // Initialize the database
        competitionPromptRepository.saveAndFlush(competitionPrompt);

        // Get the competitionPrompt
        restCompetitionPromptMockMvc
            .perform(get(ENTITY_API_URL_ID, competitionPrompt.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(competitionPrompt.getId().intValue()))
            .andExpect(jsonPath("$.linkedCompetition").value(DEFAULT_LINKED_COMPETITION.intValue()))
            .andExpect(jsonPath("$.promptContent").value(DEFAULT_PROMPT_CONTENT));
    }

    @Test
    @Transactional
    void getNonExistingCompetitionPrompt() throws Exception {
        // Get the competitionPrompt
        restCompetitionPromptMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompetitionPrompt() throws Exception {
        // Initialize the database
        competitionPromptRepository.saveAndFlush(competitionPrompt);

        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();

        // Update the competitionPrompt
        CompetitionPrompt updatedCompetitionPrompt = competitionPromptRepository.findById(competitionPrompt.getId()).get();
        // Disconnect from session so that the updates on updatedCompetitionPrompt are not directly saved in db
        em.detach(updatedCompetitionPrompt);
        updatedCompetitionPrompt.linkedCompetition(UPDATED_LINKED_COMPETITION).promptContent(UPDATED_PROMPT_CONTENT);

        restCompetitionPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompetitionPrompt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompetitionPrompt))
            )
            .andExpect(status().isOk());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
        CompetitionPrompt testCompetitionPrompt = competitionPromptList.get(competitionPromptList.size() - 1);
        assertThat(testCompetitionPrompt.getLinkedCompetition()).isEqualTo(UPDATED_LINKED_COMPETITION);
        assertThat(testCompetitionPrompt.getPromptContent()).isEqualTo(UPDATED_PROMPT_CONTENT);
    }

    @Test
    @Transactional
    void putNonExistingCompetitionPrompt() throws Exception {
        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();
        competitionPrompt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompetitionPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, competitionPrompt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(competitionPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompetitionPrompt() throws Exception {
        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();
        competitionPrompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompetitionPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(competitionPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompetitionPrompt() throws Exception {
        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();
        competitionPrompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompetitionPromptMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(competitionPrompt))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompetitionPromptWithPatch() throws Exception {
        // Initialize the database
        competitionPromptRepository.saveAndFlush(competitionPrompt);

        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();

        // Update the competitionPrompt using partial update
        CompetitionPrompt partialUpdatedCompetitionPrompt = new CompetitionPrompt();
        partialUpdatedCompetitionPrompt.setId(competitionPrompt.getId());

        restCompetitionPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompetitionPrompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompetitionPrompt))
            )
            .andExpect(status().isOk());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
        CompetitionPrompt testCompetitionPrompt = competitionPromptList.get(competitionPromptList.size() - 1);
        assertThat(testCompetitionPrompt.getLinkedCompetition()).isEqualTo(DEFAULT_LINKED_COMPETITION);
        assertThat(testCompetitionPrompt.getPromptContent()).isEqualTo(DEFAULT_PROMPT_CONTENT);
    }

    @Test
    @Transactional
    void fullUpdateCompetitionPromptWithPatch() throws Exception {
        // Initialize the database
        competitionPromptRepository.saveAndFlush(competitionPrompt);

        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();

        // Update the competitionPrompt using partial update
        CompetitionPrompt partialUpdatedCompetitionPrompt = new CompetitionPrompt();
        partialUpdatedCompetitionPrompt.setId(competitionPrompt.getId());

        partialUpdatedCompetitionPrompt.linkedCompetition(UPDATED_LINKED_COMPETITION).promptContent(UPDATED_PROMPT_CONTENT);

        restCompetitionPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompetitionPrompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompetitionPrompt))
            )
            .andExpect(status().isOk());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
        CompetitionPrompt testCompetitionPrompt = competitionPromptList.get(competitionPromptList.size() - 1);
        assertThat(testCompetitionPrompt.getLinkedCompetition()).isEqualTo(UPDATED_LINKED_COMPETITION);
        assertThat(testCompetitionPrompt.getPromptContent()).isEqualTo(UPDATED_PROMPT_CONTENT);
    }

    @Test
    @Transactional
    void patchNonExistingCompetitionPrompt() throws Exception {
        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();
        competitionPrompt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompetitionPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, competitionPrompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(competitionPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompetitionPrompt() throws Exception {
        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();
        competitionPrompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompetitionPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(competitionPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompetitionPrompt() throws Exception {
        int databaseSizeBeforeUpdate = competitionPromptRepository.findAll().size();
        competitionPrompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompetitionPromptMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(competitionPrompt))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompetitionPrompt in the database
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompetitionPrompt() throws Exception {
        // Initialize the database
        competitionPromptRepository.saveAndFlush(competitionPrompt);

        int databaseSizeBeforeDelete = competitionPromptRepository.findAll().size();

        // Delete the competitionPrompt
        restCompetitionPromptMockMvc
            .perform(delete(ENTITY_API_URL_ID, competitionPrompt.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompetitionPrompt> competitionPromptList = competitionPromptRepository.findAll();
        assertThat(competitionPromptList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
