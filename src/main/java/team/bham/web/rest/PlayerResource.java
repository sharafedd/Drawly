package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Player;
import team.bham.repository.PlayerRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Player}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlayerResource {

    private final Logger log = LoggerFactory.getLogger(PlayerResource.class);

    private static final String ENTITY_NAME = "player";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlayerRepository playerRepository;

    public PlayerResource(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    /**
     * {@code POST  /players} : Create a new player.
     *
     * @param player the player to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new player, or with status {@code 400 (Bad Request)} if the player has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/players")
    public ResponseEntity<Player> createPlayer(@Valid @RequestBody Player player) throws URISyntaxException {
        log.debug("REST request to save Player : {}", player);
        if (player.getId() != null) {
            throw new BadRequestAlertException("A new player cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Player result = playerRepository.save(player);
        return ResponseEntity
            .created(new URI("/api/players/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /players/:id} : Updates an existing player.
     *
     * @param id the id of the player to save.
     * @param player the player to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated player,
     * or with status {@code 400 (Bad Request)} if the player is not valid,
     * or with status {@code 500 (Internal Server Error)} if the player couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/players/{id}")
    public ResponseEntity<Player> updatePlayer(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Player player
    ) throws URISyntaxException {
        log.debug("REST request to update Player : {}, {}", id, player);
        if (player.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, player.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!playerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Player result = playerRepository.save(player);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, player.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /players/:id} : Partial updates given fields of an existing player, field will ignore if it is null
     *
     * @param id the id of the player to save.
     * @param player the player to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated player,
     * or with status {@code 400 (Bad Request)} if the player is not valid,
     * or with status {@code 404 (Not Found)} if the player is not found,
     * or with status {@code 500 (Internal Server Error)} if the player couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/players/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Player> partialUpdatePlayer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Player player
    ) throws URISyntaxException {
        log.debug("REST request to partial update Player partially : {}, {}", id, player);
        if (player.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, player.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!playerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Player> result = playerRepository
            .findById(player.getId())
            .map(existingPlayer -> {
                if (player.getLinkedUser() != null) {
                    existingPlayer.setLinkedUser(player.getLinkedUser());
                }
                if (player.getLinkedRoom() != null) {
                    existingPlayer.setLinkedRoom(player.getLinkedRoom());
                }
                if (player.getUsername() != null) {
                    existingPlayer.setUsername(player.getUsername());
                }
                if (player.getDrawing() != null) {
                    existingPlayer.setDrawing(player.getDrawing());
                }
                if (player.getDrawingContentType() != null) {
                    existingPlayer.setDrawingContentType(player.getDrawingContentType());
                }
                if (player.getTotalStars() != null) {
                    existingPlayer.setTotalStars(player.getTotalStars());
                }
                if (player.getRank() != null) {
                    existingPlayer.setRank(player.getRank());
                }

                return existingPlayer;
            })
            .map(playerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, player.getId().toString())
        );
    }

    /**
     * {@code GET  /players} : get all the players.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of players in body.
     */
    @GetMapping("/players")
    public List<Player> getAllPlayers() {
        log.debug("REST request to get all Players");
        return playerRepository.findAll();
    }

    /**
     * {@code GET  /players/:id} : get the "id" player.
     *
     * @param id the id of the player to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the player, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/players/{id}")
    public ResponseEntity<Player> getPlayer(@PathVariable Long id) {
        log.debug("REST request to get Player : {}", id);
        Optional<Player> player = playerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(player);
    }

    /**
     * {@code DELETE  /players/:id} : delete the "id" player.
     *
     * @param id the id of the player to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/players/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        log.debug("REST request to delete Player : {}", id);
        playerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
