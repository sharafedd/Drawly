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
import team.bham.domain.Round;
import team.bham.repository.RoundRepository;

/**
 * Integration tests for the {@link RoundResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RoundResourceIT {

    private static final Long DEFAULT_LINKED_PROMPT = 1L;
    private static final Long UPDATED_LINKED_PROMPT = 2L;

    private static final Long DEFAULT_LINKED_ROOM = 1L;
    private static final Long UPDATED_LINKED_ROOM = 2L;

    private static final Integer DEFAULT_ROUND_NUMBER = 1;
    private static final Integer UPDATED_ROUND_NUMBER = 2;

    private static final String ENTITY_API_URL = "/api/rounds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RoundRepository roundRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRoundMockMvc;

    private Round round;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Round createEntity(EntityManager em) {
        Round round = new Round().linkedPrompt(DEFAULT_LINKED_PROMPT).linkedRoom(DEFAULT_LINKED_ROOM).roundNumber(DEFAULT_ROUND_NUMBER);
        return round;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Round createUpdatedEntity(EntityManager em) {
        Round round = new Round().linkedPrompt(UPDATED_LINKED_PROMPT).linkedRoom(UPDATED_LINKED_ROOM).roundNumber(UPDATED_ROUND_NUMBER);
        return round;
    }

    @BeforeEach
    public void initTest() {
        round = createEntity(em);
    }

    @Test
    @Transactional
    void createRound() throws Exception {
        int databaseSizeBeforeCreate = roundRepository.findAll().size();
        // Create the Round
        restRoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(round)))
            .andExpect(status().isCreated());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeCreate + 1);
        Round testRound = roundList.get(roundList.size() - 1);
        assertThat(testRound.getLinkedPrompt()).isEqualTo(DEFAULT_LINKED_PROMPT);
        assertThat(testRound.getLinkedRoom()).isEqualTo(DEFAULT_LINKED_ROOM);
        assertThat(testRound.getRoundNumber()).isEqualTo(DEFAULT_ROUND_NUMBER);
    }

    @Test
    @Transactional
    void createRoundWithExistingId() throws Exception {
        // Create the Round with an existing ID
        round.setId(1L);

        int databaseSizeBeforeCreate = roundRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(round)))
            .andExpect(status().isBadRequest());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRounds() throws Exception {
        // Initialize the database
        roundRepository.saveAndFlush(round);

        // Get all the roundList
        restRoundMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(round.getId().intValue())))
            .andExpect(jsonPath("$.[*].linkedPrompt").value(hasItem(DEFAULT_LINKED_PROMPT.intValue())))
            .andExpect(jsonPath("$.[*].linkedRoom").value(hasItem(DEFAULT_LINKED_ROOM.intValue())))
            .andExpect(jsonPath("$.[*].roundNumber").value(hasItem(DEFAULT_ROUND_NUMBER)));
    }

    @Test
    @Transactional
    void getRound() throws Exception {
        // Initialize the database
        roundRepository.saveAndFlush(round);

        // Get the round
        restRoundMockMvc
            .perform(get(ENTITY_API_URL_ID, round.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(round.getId().intValue()))
            .andExpect(jsonPath("$.linkedPrompt").value(DEFAULT_LINKED_PROMPT.intValue()))
            .andExpect(jsonPath("$.linkedRoom").value(DEFAULT_LINKED_ROOM.intValue()))
            .andExpect(jsonPath("$.roundNumber").value(DEFAULT_ROUND_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingRound() throws Exception {
        // Get the round
        restRoundMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRound() throws Exception {
        // Initialize the database
        roundRepository.saveAndFlush(round);

        int databaseSizeBeforeUpdate = roundRepository.findAll().size();

        // Update the round
        Round updatedRound = roundRepository.findById(round.getId()).get();
        // Disconnect from session so that the updates on updatedRound are not directly saved in db
        em.detach(updatedRound);
        updatedRound.linkedPrompt(UPDATED_LINKED_PROMPT).linkedRoom(UPDATED_LINKED_ROOM).roundNumber(UPDATED_ROUND_NUMBER);

        restRoundMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRound.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRound))
            )
            .andExpect(status().isOk());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
        Round testRound = roundList.get(roundList.size() - 1);
        assertThat(testRound.getLinkedPrompt()).isEqualTo(UPDATED_LINKED_PROMPT);
        assertThat(testRound.getLinkedRoom()).isEqualTo(UPDATED_LINKED_ROOM);
        assertThat(testRound.getRoundNumber()).isEqualTo(UPDATED_ROUND_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingRound() throws Exception {
        int databaseSizeBeforeUpdate = roundRepository.findAll().size();
        round.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoundMockMvc
            .perform(
                put(ENTITY_API_URL_ID, round.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(round))
            )
            .andExpect(status().isBadRequest());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRound() throws Exception {
        int databaseSizeBeforeUpdate = roundRepository.findAll().size();
        round.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoundMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(round))
            )
            .andExpect(status().isBadRequest());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRound() throws Exception {
        int databaseSizeBeforeUpdate = roundRepository.findAll().size();
        round.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoundMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(round)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRoundWithPatch() throws Exception {
        // Initialize the database
        roundRepository.saveAndFlush(round);

        int databaseSizeBeforeUpdate = roundRepository.findAll().size();

        // Update the round using partial update
        Round partialUpdatedRound = new Round();
        partialUpdatedRound.setId(round.getId());

        restRoundMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRound.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRound))
            )
            .andExpect(status().isOk());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
        Round testRound = roundList.get(roundList.size() - 1);
        assertThat(testRound.getLinkedPrompt()).isEqualTo(DEFAULT_LINKED_PROMPT);
        assertThat(testRound.getLinkedRoom()).isEqualTo(DEFAULT_LINKED_ROOM);
        assertThat(testRound.getRoundNumber()).isEqualTo(DEFAULT_ROUND_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateRoundWithPatch() throws Exception {
        // Initialize the database
        roundRepository.saveAndFlush(round);

        int databaseSizeBeforeUpdate = roundRepository.findAll().size();

        // Update the round using partial update
        Round partialUpdatedRound = new Round();
        partialUpdatedRound.setId(round.getId());

        partialUpdatedRound.linkedPrompt(UPDATED_LINKED_PROMPT).linkedRoom(UPDATED_LINKED_ROOM).roundNumber(UPDATED_ROUND_NUMBER);

        restRoundMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRound.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRound))
            )
            .andExpect(status().isOk());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
        Round testRound = roundList.get(roundList.size() - 1);
        assertThat(testRound.getLinkedPrompt()).isEqualTo(UPDATED_LINKED_PROMPT);
        assertThat(testRound.getLinkedRoom()).isEqualTo(UPDATED_LINKED_ROOM);
        assertThat(testRound.getRoundNumber()).isEqualTo(UPDATED_ROUND_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingRound() throws Exception {
        int databaseSizeBeforeUpdate = roundRepository.findAll().size();
        round.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoundMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, round.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(round))
            )
            .andExpect(status().isBadRequest());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRound() throws Exception {
        int databaseSizeBeforeUpdate = roundRepository.findAll().size();
        round.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoundMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(round))
            )
            .andExpect(status().isBadRequest());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRound() throws Exception {
        int databaseSizeBeforeUpdate = roundRepository.findAll().size();
        round.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoundMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(round)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Round in the database
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRound() throws Exception {
        // Initialize the database
        roundRepository.saveAndFlush(round);

        int databaseSizeBeforeDelete = roundRepository.findAll().size();

        // Delete the round
        restRoundMockMvc
            .perform(delete(ENTITY_API_URL_ID, round.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Round> roundList = roundRepository.findAll();
        assertThat(roundList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
