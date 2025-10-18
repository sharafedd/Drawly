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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.Player;
import team.bham.repository.PlayerRepository;

/**
 * Integration tests for the {@link PlayerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlayerResourceIT {

    private static final Long DEFAULT_LINKED_USER = 1L;
    private static final Long UPDATED_LINKED_USER = 2L;

    private static final Long DEFAULT_LINKED_ROOM = 1L;
    private static final Long UPDATED_LINKED_ROOM = 2L;

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_DRAWING = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DRAWING = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DRAWING_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DRAWING_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_TOTAL_STARS = 1;
    private static final Integer UPDATED_TOTAL_STARS = 2;

    private static final Integer DEFAULT_RANK = 1;
    private static final Integer UPDATED_RANK = 2;

    private static final String ENTITY_API_URL = "/api/players";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlayerMockMvc;

    private Player player;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Player createEntity(EntityManager em) {
        Player player = new Player()
            .linkedUser(DEFAULT_LINKED_USER)
            .linkedRoom(DEFAULT_LINKED_ROOM)
            .username(DEFAULT_USERNAME)
            .drawing(DEFAULT_DRAWING)
            .drawingContentType(DEFAULT_DRAWING_CONTENT_TYPE)
            .totalStars(DEFAULT_TOTAL_STARS)
            .rank(DEFAULT_RANK);
        return player;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Player createUpdatedEntity(EntityManager em) {
        Player player = new Player()
            .linkedUser(UPDATED_LINKED_USER)
            .linkedRoom(UPDATED_LINKED_ROOM)
            .username(UPDATED_USERNAME)
            .drawing(UPDATED_DRAWING)
            .drawingContentType(UPDATED_DRAWING_CONTENT_TYPE)
            .totalStars(UPDATED_TOTAL_STARS)
            .rank(UPDATED_RANK);
        return player;
    }

    @BeforeEach
    public void initTest() {
        player = createEntity(em);
    }

    @Test
    @Transactional
    void createPlayer() throws Exception {
        int databaseSizeBeforeCreate = playerRepository.findAll().size();
        // Create the Player
        restPlayerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(player)))
            .andExpect(status().isCreated());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeCreate + 1);
        Player testPlayer = playerList.get(playerList.size() - 1);
        assertThat(testPlayer.getLinkedUser()).isEqualTo(DEFAULT_LINKED_USER);
        assertThat(testPlayer.getLinkedRoom()).isEqualTo(DEFAULT_LINKED_ROOM);
        assertThat(testPlayer.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testPlayer.getDrawing()).isEqualTo(DEFAULT_DRAWING);
        assertThat(testPlayer.getDrawingContentType()).isEqualTo(DEFAULT_DRAWING_CONTENT_TYPE);
        assertThat(testPlayer.getTotalStars()).isEqualTo(DEFAULT_TOTAL_STARS);
        assertThat(testPlayer.getRank()).isEqualTo(DEFAULT_RANK);
    }

    @Test
    @Transactional
    void createPlayerWithExistingId() throws Exception {
        // Create the Player with an existing ID
        player.setId(1L);

        int databaseSizeBeforeCreate = playerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlayerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(player)))
            .andExpect(status().isBadRequest());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlayers() throws Exception {
        // Initialize the database
        playerRepository.saveAndFlush(player);

        // Get all the playerList
        restPlayerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(player.getId().intValue())))
            .andExpect(jsonPath("$.[*].linkedUser").value(hasItem(DEFAULT_LINKED_USER.intValue())))
            .andExpect(jsonPath("$.[*].linkedRoom").value(hasItem(DEFAULT_LINKED_ROOM.intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].drawingContentType").value(hasItem(DEFAULT_DRAWING_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].drawing").value(hasItem(Base64Utils.encodeToString(DEFAULT_DRAWING))))
            .andExpect(jsonPath("$.[*].totalStars").value(hasItem(DEFAULT_TOTAL_STARS)))
            .andExpect(jsonPath("$.[*].rank").value(hasItem(DEFAULT_RANK)));
    }

    @Test
    @Transactional
    void getPlayer() throws Exception {
        // Initialize the database
        playerRepository.saveAndFlush(player);

        // Get the player
        restPlayerMockMvc
            .perform(get(ENTITY_API_URL_ID, player.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(player.getId().intValue()))
            .andExpect(jsonPath("$.linkedUser").value(DEFAULT_LINKED_USER.intValue()))
            .andExpect(jsonPath("$.linkedRoom").value(DEFAULT_LINKED_ROOM.intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.drawingContentType").value(DEFAULT_DRAWING_CONTENT_TYPE))
            .andExpect(jsonPath("$.drawing").value(Base64Utils.encodeToString(DEFAULT_DRAWING)))
            .andExpect(jsonPath("$.totalStars").value(DEFAULT_TOTAL_STARS))
            .andExpect(jsonPath("$.rank").value(DEFAULT_RANK));
    }

    @Test
    @Transactional
    void getNonExistingPlayer() throws Exception {
        // Get the player
        restPlayerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlayer() throws Exception {
        // Initialize the database
        playerRepository.saveAndFlush(player);

        int databaseSizeBeforeUpdate = playerRepository.findAll().size();

        // Update the player
        Player updatedPlayer = playerRepository.findById(player.getId()).get();
        // Disconnect from session so that the updates on updatedPlayer are not directly saved in db
        em.detach(updatedPlayer);
        updatedPlayer
            .linkedUser(UPDATED_LINKED_USER)
            .linkedRoom(UPDATED_LINKED_ROOM)
            .username(UPDATED_USERNAME)
            .drawing(UPDATED_DRAWING)
            .drawingContentType(UPDATED_DRAWING_CONTENT_TYPE)
            .totalStars(UPDATED_TOTAL_STARS)
            .rank(UPDATED_RANK);

        restPlayerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlayer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlayer))
            )
            .andExpect(status().isOk());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
        Player testPlayer = playerList.get(playerList.size() - 1);
        assertThat(testPlayer.getLinkedUser()).isEqualTo(UPDATED_LINKED_USER);
        assertThat(testPlayer.getLinkedRoom()).isEqualTo(UPDATED_LINKED_ROOM);
        assertThat(testPlayer.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testPlayer.getDrawing()).isEqualTo(UPDATED_DRAWING);
        assertThat(testPlayer.getDrawingContentType()).isEqualTo(UPDATED_DRAWING_CONTENT_TYPE);
        assertThat(testPlayer.getTotalStars()).isEqualTo(UPDATED_TOTAL_STARS);
        assertThat(testPlayer.getRank()).isEqualTo(UPDATED_RANK);
    }

    @Test
    @Transactional
    void putNonExistingPlayer() throws Exception {
        int databaseSizeBeforeUpdate = playerRepository.findAll().size();
        player.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlayerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, player.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(player))
            )
            .andExpect(status().isBadRequest());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlayer() throws Exception {
        int databaseSizeBeforeUpdate = playerRepository.findAll().size();
        player.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(player))
            )
            .andExpect(status().isBadRequest());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlayer() throws Exception {
        int databaseSizeBeforeUpdate = playerRepository.findAll().size();
        player.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(player)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlayerWithPatch() throws Exception {
        // Initialize the database
        playerRepository.saveAndFlush(player);

        int databaseSizeBeforeUpdate = playerRepository.findAll().size();

        // Update the player using partial update
        Player partialUpdatedPlayer = new Player();
        partialUpdatedPlayer.setId(player.getId());

        partialUpdatedPlayer
            .linkedUser(UPDATED_LINKED_USER)
            .linkedRoom(UPDATED_LINKED_ROOM)
            .username(UPDATED_USERNAME)
            .totalStars(UPDATED_TOTAL_STARS)
            .rank(UPDATED_RANK);

        restPlayerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlayer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlayer))
            )
            .andExpect(status().isOk());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
        Player testPlayer = playerList.get(playerList.size() - 1);
        assertThat(testPlayer.getLinkedUser()).isEqualTo(UPDATED_LINKED_USER);
        assertThat(testPlayer.getLinkedRoom()).isEqualTo(UPDATED_LINKED_ROOM);
        assertThat(testPlayer.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testPlayer.getDrawing()).isEqualTo(DEFAULT_DRAWING);
        assertThat(testPlayer.getDrawingContentType()).isEqualTo(DEFAULT_DRAWING_CONTENT_TYPE);
        assertThat(testPlayer.getTotalStars()).isEqualTo(UPDATED_TOTAL_STARS);
        assertThat(testPlayer.getRank()).isEqualTo(UPDATED_RANK);
    }

    @Test
    @Transactional
    void fullUpdatePlayerWithPatch() throws Exception {
        // Initialize the database
        playerRepository.saveAndFlush(player);

        int databaseSizeBeforeUpdate = playerRepository.findAll().size();

        // Update the player using partial update
        Player partialUpdatedPlayer = new Player();
        partialUpdatedPlayer.setId(player.getId());

        partialUpdatedPlayer
            .linkedUser(UPDATED_LINKED_USER)
            .linkedRoom(UPDATED_LINKED_ROOM)
            .username(UPDATED_USERNAME)
            .drawing(UPDATED_DRAWING)
            .drawingContentType(UPDATED_DRAWING_CONTENT_TYPE)
            .totalStars(UPDATED_TOTAL_STARS)
            .rank(UPDATED_RANK);

        restPlayerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlayer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlayer))
            )
            .andExpect(status().isOk());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
        Player testPlayer = playerList.get(playerList.size() - 1);
        assertThat(testPlayer.getLinkedUser()).isEqualTo(UPDATED_LINKED_USER);
        assertThat(testPlayer.getLinkedRoom()).isEqualTo(UPDATED_LINKED_ROOM);
        assertThat(testPlayer.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testPlayer.getDrawing()).isEqualTo(UPDATED_DRAWING);
        assertThat(testPlayer.getDrawingContentType()).isEqualTo(UPDATED_DRAWING_CONTENT_TYPE);
        assertThat(testPlayer.getTotalStars()).isEqualTo(UPDATED_TOTAL_STARS);
        assertThat(testPlayer.getRank()).isEqualTo(UPDATED_RANK);
    }

    @Test
    @Transactional
    void patchNonExistingPlayer() throws Exception {
        int databaseSizeBeforeUpdate = playerRepository.findAll().size();
        player.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlayerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, player.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(player))
            )
            .andExpect(status().isBadRequest());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlayer() throws Exception {
        int databaseSizeBeforeUpdate = playerRepository.findAll().size();
        player.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(player))
            )
            .andExpect(status().isBadRequest());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlayer() throws Exception {
        int databaseSizeBeforeUpdate = playerRepository.findAll().size();
        player.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(player)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Player in the database
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlayer() throws Exception {
        // Initialize the database
        playerRepository.saveAndFlush(player);

        int databaseSizeBeforeDelete = playerRepository.findAll().size();

        // Delete the player
        restPlayerMockMvc
            .perform(delete(ENTITY_API_URL_ID, player.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Player> playerList = playerRepository.findAll();
        assertThat(playerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
