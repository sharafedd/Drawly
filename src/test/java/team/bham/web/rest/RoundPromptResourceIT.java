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
import team.bham.domain.RoundPrompt;
import team.bham.repository.RoundPromptRepository;

/**
 * Integration tests for the {@link RoundPromptResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RoundPromptResourceIT {

    private static final Long DEFAULT_LINKED_ROOM = 1L;
    private static final Long UPDATED_LINKED_ROOM = 2L;

    private static final Long DEFAULT_LINKED_ROUND = 1L;
    private static final Long UPDATED_LINKED_ROUND = 2L;

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/round-prompts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RoundPromptRepository roundPromptRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRoundPromptMockMvc;

    private RoundPrompt roundPrompt;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoundPrompt createEntity(EntityManager em) {
        RoundPrompt roundPrompt = new RoundPrompt()
            .linkedRoom(DEFAULT_LINKED_ROOM)
            .linkedRound(DEFAULT_LINKED_ROUND)
            .content(DEFAULT_CONTENT);
        return roundPrompt;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoundPrompt createUpdatedEntity(EntityManager em) {
        RoundPrompt roundPrompt = new RoundPrompt()
            .linkedRoom(UPDATED_LINKED_ROOM)
            .linkedRound(UPDATED_LINKED_ROUND)
            .content(UPDATED_CONTENT);
        return roundPrompt;
    }

    @BeforeEach
    public void initTest() {
        roundPrompt = createEntity(em);
    }

    @Test
    @Transactional
    void createRoundPrompt() throws Exception {
        int databaseSizeBeforeCreate = roundPromptRepository.findAll().size();
        // Create the RoundPrompt
        restRoundPromptMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roundPrompt)))
            .andExpect(status().isCreated());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeCreate + 1);
        RoundPrompt testRoundPrompt = roundPromptList.get(roundPromptList.size() - 1);
        assertThat(testRoundPrompt.getLinkedRoom()).isEqualTo(DEFAULT_LINKED_ROOM);
        assertThat(testRoundPrompt.getLinkedRound()).isEqualTo(DEFAULT_LINKED_ROUND);
        assertThat(testRoundPrompt.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void createRoundPromptWithExistingId() throws Exception {
        // Create the RoundPrompt with an existing ID
        roundPrompt.setId(1L);

        int databaseSizeBeforeCreate = roundPromptRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoundPromptMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roundPrompt)))
            .andExpect(status().isBadRequest());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRoundPrompts() throws Exception {
        // Initialize the database
        roundPromptRepository.saveAndFlush(roundPrompt);

        // Get all the roundPromptList
        restRoundPromptMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(roundPrompt.getId().intValue())))
            .andExpect(jsonPath("$.[*].linkedRoom").value(hasItem(DEFAULT_LINKED_ROOM.intValue())))
            .andExpect(jsonPath("$.[*].linkedRound").value(hasItem(DEFAULT_LINKED_ROUND.intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)));
    }

    @Test
    @Transactional
    void getRoundPrompt() throws Exception {
        // Initialize the database
        roundPromptRepository.saveAndFlush(roundPrompt);

        // Get the roundPrompt
        restRoundPromptMockMvc
            .perform(get(ENTITY_API_URL_ID, roundPrompt.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(roundPrompt.getId().intValue()))
            .andExpect(jsonPath("$.linkedRoom").value(DEFAULT_LINKED_ROOM.intValue()))
            .andExpect(jsonPath("$.linkedRound").value(DEFAULT_LINKED_ROUND.intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT));
    }

    @Test
    @Transactional
    void getNonExistingRoundPrompt() throws Exception {
        // Get the roundPrompt
        restRoundPromptMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRoundPrompt() throws Exception {
        // Initialize the database
        roundPromptRepository.saveAndFlush(roundPrompt);

        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();

        // Update the roundPrompt
        RoundPrompt updatedRoundPrompt = roundPromptRepository.findById(roundPrompt.getId()).get();
        // Disconnect from session so that the updates on updatedRoundPrompt are not directly saved in db
        em.detach(updatedRoundPrompt);
        updatedRoundPrompt.linkedRoom(UPDATED_LINKED_ROOM).linkedRound(UPDATED_LINKED_ROUND).content(UPDATED_CONTENT);

        restRoundPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRoundPrompt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRoundPrompt))
            )
            .andExpect(status().isOk());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
        RoundPrompt testRoundPrompt = roundPromptList.get(roundPromptList.size() - 1);
        assertThat(testRoundPrompt.getLinkedRoom()).isEqualTo(UPDATED_LINKED_ROOM);
        assertThat(testRoundPrompt.getLinkedRound()).isEqualTo(UPDATED_LINKED_ROUND);
        assertThat(testRoundPrompt.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void putNonExistingRoundPrompt() throws Exception {
        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();
        roundPrompt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoundPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, roundPrompt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roundPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRoundPrompt() throws Exception {
        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();
        roundPrompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoundPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roundPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRoundPrompt() throws Exception {
        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();
        roundPrompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoundPromptMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roundPrompt)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRoundPromptWithPatch() throws Exception {
        // Initialize the database
        roundPromptRepository.saveAndFlush(roundPrompt);

        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();

        // Update the roundPrompt using partial update
        RoundPrompt partialUpdatedRoundPrompt = new RoundPrompt();
        partialUpdatedRoundPrompt.setId(roundPrompt.getId());

        partialUpdatedRoundPrompt.linkedRound(UPDATED_LINKED_ROUND);

        restRoundPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoundPrompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoundPrompt))
            )
            .andExpect(status().isOk());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
        RoundPrompt testRoundPrompt = roundPromptList.get(roundPromptList.size() - 1);
        assertThat(testRoundPrompt.getLinkedRoom()).isEqualTo(DEFAULT_LINKED_ROOM);
        assertThat(testRoundPrompt.getLinkedRound()).isEqualTo(UPDATED_LINKED_ROUND);
        assertThat(testRoundPrompt.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void fullUpdateRoundPromptWithPatch() throws Exception {
        // Initialize the database
        roundPromptRepository.saveAndFlush(roundPrompt);

        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();

        // Update the roundPrompt using partial update
        RoundPrompt partialUpdatedRoundPrompt = new RoundPrompt();
        partialUpdatedRoundPrompt.setId(roundPrompt.getId());

        partialUpdatedRoundPrompt.linkedRoom(UPDATED_LINKED_ROOM).linkedRound(UPDATED_LINKED_ROUND).content(UPDATED_CONTENT);

        restRoundPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoundPrompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoundPrompt))
            )
            .andExpect(status().isOk());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
        RoundPrompt testRoundPrompt = roundPromptList.get(roundPromptList.size() - 1);
        assertThat(testRoundPrompt.getLinkedRoom()).isEqualTo(UPDATED_LINKED_ROOM);
        assertThat(testRoundPrompt.getLinkedRound()).isEqualTo(UPDATED_LINKED_ROUND);
        assertThat(testRoundPrompt.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void patchNonExistingRoundPrompt() throws Exception {
        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();
        roundPrompt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoundPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, roundPrompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roundPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRoundPrompt() throws Exception {
        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();
        roundPrompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoundPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roundPrompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRoundPrompt() throws Exception {
        int databaseSizeBeforeUpdate = roundPromptRepository.findAll().size();
        roundPrompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoundPromptMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(roundPrompt))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RoundPrompt in the database
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRoundPrompt() throws Exception {
        // Initialize the database
        roundPromptRepository.saveAndFlush(roundPrompt);

        int databaseSizeBeforeDelete = roundPromptRepository.findAll().size();

        // Delete the roundPrompt
        restRoundPromptMockMvc
            .perform(delete(ENTITY_API_URL_ID, roundPrompt.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RoundPrompt> roundPromptList = roundPromptRepository.findAll();
        assertThat(roundPromptList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
