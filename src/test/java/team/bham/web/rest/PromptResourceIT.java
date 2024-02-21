package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static team.bham.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
import team.bham.domain.Prompt;
import team.bham.repository.PromptRepository;

/**
 * Integration tests for the {@link PromptResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PromptResourceIT {

    private static final Integer DEFAULT_PROMPT_ID = 1;
    private static final Integer UPDATED_PROMPT_ID = 2;

    private static final String DEFAULT_PROMPT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_PROMPT_CONTENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_PROMPT_DEADLINE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_PROMPT_DEADLINE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_PARTICIPANTS_NUM = 1;
    private static final Integer UPDATED_PARTICIPANTS_NUM = 2;

    private static final String ENTITY_API_URL = "/api/prompts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PromptRepository promptRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPromptMockMvc;

    private Prompt prompt;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prompt createEntity(EntityManager em) {
        Prompt prompt = new Prompt()
            .promptID(DEFAULT_PROMPT_ID)
            .promptContent(DEFAULT_PROMPT_CONTENT)
            .promptDeadline(DEFAULT_PROMPT_DEADLINE)
            .participantsNum(DEFAULT_PARTICIPANTS_NUM);
        return prompt;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prompt createUpdatedEntity(EntityManager em) {
        Prompt prompt = new Prompt()
            .promptID(UPDATED_PROMPT_ID)
            .promptContent(UPDATED_PROMPT_CONTENT)
            .promptDeadline(UPDATED_PROMPT_DEADLINE)
            .participantsNum(UPDATED_PARTICIPANTS_NUM);
        return prompt;
    }

    @BeforeEach
    public void initTest() {
        prompt = createEntity(em);
    }

    @Test
    @Transactional
    void createPrompt() throws Exception {
        int databaseSizeBeforeCreate = promptRepository.findAll().size();
        // Create the Prompt
        restPromptMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prompt)))
            .andExpect(status().isCreated());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeCreate + 1);
        Prompt testPrompt = promptList.get(promptList.size() - 1);
        assertThat(testPrompt.getPromptID()).isEqualTo(DEFAULT_PROMPT_ID);
        assertThat(testPrompt.getPromptContent()).isEqualTo(DEFAULT_PROMPT_CONTENT);
        assertThat(testPrompt.getPromptDeadline()).isEqualTo(DEFAULT_PROMPT_DEADLINE);
        assertThat(testPrompt.getParticipantsNum()).isEqualTo(DEFAULT_PARTICIPANTS_NUM);
    }

    @Test
    @Transactional
    void createPromptWithExistingId() throws Exception {
        // Create the Prompt with an existing ID
        prompt.setId(1L);

        int databaseSizeBeforeCreate = promptRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPromptMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prompt)))
            .andExpect(status().isBadRequest());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPrompts() throws Exception {
        // Initialize the database
        promptRepository.saveAndFlush(prompt);

        // Get all the promptList
        restPromptMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(prompt.getId().intValue())))
            .andExpect(jsonPath("$.[*].promptID").value(hasItem(DEFAULT_PROMPT_ID)))
            .andExpect(jsonPath("$.[*].promptContent").value(hasItem(DEFAULT_PROMPT_CONTENT)))
            .andExpect(jsonPath("$.[*].promptDeadline").value(hasItem(sameInstant(DEFAULT_PROMPT_DEADLINE))))
            .andExpect(jsonPath("$.[*].participantsNum").value(hasItem(DEFAULT_PARTICIPANTS_NUM)));
    }

    @Test
    @Transactional
    void getPrompt() throws Exception {
        // Initialize the database
        promptRepository.saveAndFlush(prompt);

        // Get the prompt
        restPromptMockMvc
            .perform(get(ENTITY_API_URL_ID, prompt.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(prompt.getId().intValue()))
            .andExpect(jsonPath("$.promptID").value(DEFAULT_PROMPT_ID))
            .andExpect(jsonPath("$.promptContent").value(DEFAULT_PROMPT_CONTENT))
            .andExpect(jsonPath("$.promptDeadline").value(sameInstant(DEFAULT_PROMPT_DEADLINE)))
            .andExpect(jsonPath("$.participantsNum").value(DEFAULT_PARTICIPANTS_NUM));
    }

    @Test
    @Transactional
    void getNonExistingPrompt() throws Exception {
        // Get the prompt
        restPromptMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPrompt() throws Exception {
        // Initialize the database
        promptRepository.saveAndFlush(prompt);

        int databaseSizeBeforeUpdate = promptRepository.findAll().size();

        // Update the prompt
        Prompt updatedPrompt = promptRepository.findById(prompt.getId()).get();
        // Disconnect from session so that the updates on updatedPrompt are not directly saved in db
        em.detach(updatedPrompt);
        updatedPrompt
            .promptID(UPDATED_PROMPT_ID)
            .promptContent(UPDATED_PROMPT_CONTENT)
            .promptDeadline(UPDATED_PROMPT_DEADLINE)
            .participantsNum(UPDATED_PARTICIPANTS_NUM);

        restPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPrompt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPrompt))
            )
            .andExpect(status().isOk());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
        Prompt testPrompt = promptList.get(promptList.size() - 1);
        assertThat(testPrompt.getPromptID()).isEqualTo(UPDATED_PROMPT_ID);
        assertThat(testPrompt.getPromptContent()).isEqualTo(UPDATED_PROMPT_CONTENT);
        assertThat(testPrompt.getPromptDeadline()).isEqualTo(UPDATED_PROMPT_DEADLINE);
        assertThat(testPrompt.getParticipantsNum()).isEqualTo(UPDATED_PARTICIPANTS_NUM);
    }

    @Test
    @Transactional
    void putNonExistingPrompt() throws Exception {
        int databaseSizeBeforeUpdate = promptRepository.findAll().size();
        prompt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, prompt.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(prompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPrompt() throws Exception {
        int databaseSizeBeforeUpdate = promptRepository.findAll().size();
        prompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(prompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPrompt() throws Exception {
        int databaseSizeBeforeUpdate = promptRepository.findAll().size();
        prompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prompt)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePromptWithPatch() throws Exception {
        // Initialize the database
        promptRepository.saveAndFlush(prompt);

        int databaseSizeBeforeUpdate = promptRepository.findAll().size();

        // Update the prompt using partial update
        Prompt partialUpdatedPrompt = new Prompt();
        partialUpdatedPrompt.setId(prompt.getId());

        partialUpdatedPrompt.promptID(UPDATED_PROMPT_ID).promptDeadline(UPDATED_PROMPT_DEADLINE).participantsNum(UPDATED_PARTICIPANTS_NUM);

        restPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrompt))
            )
            .andExpect(status().isOk());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
        Prompt testPrompt = promptList.get(promptList.size() - 1);
        assertThat(testPrompt.getPromptID()).isEqualTo(UPDATED_PROMPT_ID);
        assertThat(testPrompt.getPromptContent()).isEqualTo(DEFAULT_PROMPT_CONTENT);
        assertThat(testPrompt.getPromptDeadline()).isEqualTo(UPDATED_PROMPT_DEADLINE);
        assertThat(testPrompt.getParticipantsNum()).isEqualTo(UPDATED_PARTICIPANTS_NUM);
    }

    @Test
    @Transactional
    void fullUpdatePromptWithPatch() throws Exception {
        // Initialize the database
        promptRepository.saveAndFlush(prompt);

        int databaseSizeBeforeUpdate = promptRepository.findAll().size();

        // Update the prompt using partial update
        Prompt partialUpdatedPrompt = new Prompt();
        partialUpdatedPrompt.setId(prompt.getId());

        partialUpdatedPrompt
            .promptID(UPDATED_PROMPT_ID)
            .promptContent(UPDATED_PROMPT_CONTENT)
            .promptDeadline(UPDATED_PROMPT_DEADLINE)
            .participantsNum(UPDATED_PARTICIPANTS_NUM);

        restPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrompt))
            )
            .andExpect(status().isOk());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
        Prompt testPrompt = promptList.get(promptList.size() - 1);
        assertThat(testPrompt.getPromptID()).isEqualTo(UPDATED_PROMPT_ID);
        assertThat(testPrompt.getPromptContent()).isEqualTo(UPDATED_PROMPT_CONTENT);
        assertThat(testPrompt.getPromptDeadline()).isEqualTo(UPDATED_PROMPT_DEADLINE);
        assertThat(testPrompt.getParticipantsNum()).isEqualTo(UPDATED_PARTICIPANTS_NUM);
    }

    @Test
    @Transactional
    void patchNonExistingPrompt() throws Exception {
        int databaseSizeBeforeUpdate = promptRepository.findAll().size();
        prompt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, prompt.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(prompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPrompt() throws Exception {
        int databaseSizeBeforeUpdate = promptRepository.findAll().size();
        prompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(prompt))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPrompt() throws Exception {
        int databaseSizeBeforeUpdate = promptRepository.findAll().size();
        prompt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromptMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(prompt)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prompt in the database
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePrompt() throws Exception {
        // Initialize the database
        promptRepository.saveAndFlush(prompt);

        int databaseSizeBeforeDelete = promptRepository.findAll().size();

        // Delete the prompt
        restPromptMockMvc
            .perform(delete(ENTITY_API_URL_ID, prompt.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Prompt> promptList = promptRepository.findAll();
        assertThat(promptList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
