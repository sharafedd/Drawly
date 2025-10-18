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
import team.bham.domain.Competition;
import team.bham.domain.enumeration.CompetitionType;
import team.bham.repository.CompetitionRepository;

/**
 * Integration tests for the {@link CompetitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompetitionResourceIT {

    private static final Long DEFAULT_LINKED_PROMPT = 1L;
    private static final Long UPDATED_LINKED_PROMPT = 2L;

    private static final CompetitionType DEFAULT_COMPETITION_TYPE = CompetitionType.Daily;
    private static final CompetitionType UPDATED_COMPETITION_TYPE = CompetitionType.Weekly;

    private static final Long DEFAULT_NO_OF_PARTICIPANTS = 1L;
    private static final Long UPDATED_NO_OF_PARTICIPANTS = 2L;

    private static final String ENTITY_API_URL = "/api/competitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompetitionRepository competitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompetitionMockMvc;

    private Competition competition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Competition createEntity(EntityManager em) {
        Competition competition = new Competition()
            .linkedPrompt(DEFAULT_LINKED_PROMPT)
            .competitionType(DEFAULT_COMPETITION_TYPE)
            .noOfParticipants(DEFAULT_NO_OF_PARTICIPANTS);
        return competition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Competition createUpdatedEntity(EntityManager em) {
        Competition competition = new Competition()
            .linkedPrompt(UPDATED_LINKED_PROMPT)
            .competitionType(UPDATED_COMPETITION_TYPE)
            .noOfParticipants(UPDATED_NO_OF_PARTICIPANTS);
        return competition;
    }

    @BeforeEach
    public void initTest() {
        competition = createEntity(em);
    }

    @Test
    @Transactional
    void createCompetition() throws Exception {
        int databaseSizeBeforeCreate = competitionRepository.findAll().size();
        // Create the Competition
        restCompetitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isCreated());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeCreate + 1);
        Competition testCompetition = competitionList.get(competitionList.size() - 1);
        assertThat(testCompetition.getLinkedPrompt()).isEqualTo(DEFAULT_LINKED_PROMPT);
        assertThat(testCompetition.getCompetitionType()).isEqualTo(DEFAULT_COMPETITION_TYPE);
        assertThat(testCompetition.getNoOfParticipants()).isEqualTo(DEFAULT_NO_OF_PARTICIPANTS);
    }

    @Test
    @Transactional
    void createCompetitionWithExistingId() throws Exception {
        // Create the Competition with an existing ID
        competition.setId(1L);

        int databaseSizeBeforeCreate = competitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompetitionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isBadRequest());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompetitions() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);

        // Get all the competitionList
        restCompetitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(competition.getId().intValue())))
            .andExpect(jsonPath("$.[*].linkedPrompt").value(hasItem(DEFAULT_LINKED_PROMPT.intValue())))
            .andExpect(jsonPath("$.[*].competitionType").value(hasItem(DEFAULT_COMPETITION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].noOfParticipants").value(hasItem(DEFAULT_NO_OF_PARTICIPANTS.intValue())));
    }

    @Test
    @Transactional
    void getCompetition() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);

        // Get the competition
        restCompetitionMockMvc
            .perform(get(ENTITY_API_URL_ID, competition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(competition.getId().intValue()))
            .andExpect(jsonPath("$.linkedPrompt").value(DEFAULT_LINKED_PROMPT.intValue()))
            .andExpect(jsonPath("$.competitionType").value(DEFAULT_COMPETITION_TYPE.toString()))
            .andExpect(jsonPath("$.noOfParticipants").value(DEFAULT_NO_OF_PARTICIPANTS.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingCompetition() throws Exception {
        // Get the competition
        restCompetitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompetition() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);

        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();

        // Update the competition
        Competition updatedCompetition = competitionRepository.findById(competition.getId()).get();
        // Disconnect from session so that the updates on updatedCompetition are not directly saved in db
        em.detach(updatedCompetition);
        updatedCompetition
            .linkedPrompt(UPDATED_LINKED_PROMPT)
            .competitionType(UPDATED_COMPETITION_TYPE)
            .noOfParticipants(UPDATED_NO_OF_PARTICIPANTS);

        restCompetitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompetition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompetition))
            )
            .andExpect(status().isOk());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
        Competition testCompetition = competitionList.get(competitionList.size() - 1);
        assertThat(testCompetition.getLinkedPrompt()).isEqualTo(UPDATED_LINKED_PROMPT);
        assertThat(testCompetition.getCompetitionType()).isEqualTo(UPDATED_COMPETITION_TYPE);
        assertThat(testCompetition.getNoOfParticipants()).isEqualTo(UPDATED_NO_OF_PARTICIPANTS);
    }

    @Test
    @Transactional
    void putNonExistingCompetition() throws Exception {
        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();
        competition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompetitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, competition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(competition))
            )
            .andExpect(status().isBadRequest());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompetition() throws Exception {
        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();
        competition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompetitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(competition))
            )
            .andExpect(status().isBadRequest());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompetition() throws Exception {
        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();
        competition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompetitionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompetitionWithPatch() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);

        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();

        // Update the competition using partial update
        Competition partialUpdatedCompetition = new Competition();
        partialUpdatedCompetition.setId(competition.getId());

        partialUpdatedCompetition
            .linkedPrompt(UPDATED_LINKED_PROMPT)
            .competitionType(UPDATED_COMPETITION_TYPE)
            .noOfParticipants(UPDATED_NO_OF_PARTICIPANTS);

        restCompetitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompetition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompetition))
            )
            .andExpect(status().isOk());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
        Competition testCompetition = competitionList.get(competitionList.size() - 1);
        assertThat(testCompetition.getLinkedPrompt()).isEqualTo(UPDATED_LINKED_PROMPT);
        assertThat(testCompetition.getCompetitionType()).isEqualTo(UPDATED_COMPETITION_TYPE);
        assertThat(testCompetition.getNoOfParticipants()).isEqualTo(UPDATED_NO_OF_PARTICIPANTS);
    }

    @Test
    @Transactional
    void fullUpdateCompetitionWithPatch() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);

        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();

        // Update the competition using partial update
        Competition partialUpdatedCompetition = new Competition();
        partialUpdatedCompetition.setId(competition.getId());

        partialUpdatedCompetition
            .linkedPrompt(UPDATED_LINKED_PROMPT)
            .competitionType(UPDATED_COMPETITION_TYPE)
            .noOfParticipants(UPDATED_NO_OF_PARTICIPANTS);

        restCompetitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompetition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompetition))
            )
            .andExpect(status().isOk());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
        Competition testCompetition = competitionList.get(competitionList.size() - 1);
        assertThat(testCompetition.getLinkedPrompt()).isEqualTo(UPDATED_LINKED_PROMPT);
        assertThat(testCompetition.getCompetitionType()).isEqualTo(UPDATED_COMPETITION_TYPE);
        assertThat(testCompetition.getNoOfParticipants()).isEqualTo(UPDATED_NO_OF_PARTICIPANTS);
    }

    @Test
    @Transactional
    void patchNonExistingCompetition() throws Exception {
        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();
        competition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompetitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, competition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(competition))
            )
            .andExpect(status().isBadRequest());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompetition() throws Exception {
        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();
        competition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompetitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(competition))
            )
            .andExpect(status().isBadRequest());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompetition() throws Exception {
        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();
        competition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompetitionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(competition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompetition() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);

        int databaseSizeBeforeDelete = competitionRepository.findAll().size();

        // Delete the competition
        restCompetitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, competition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
