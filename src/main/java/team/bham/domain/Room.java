package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.RoomType;

/**
 * A Room.
 */
@Entity
@Table(name = "room")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Room implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "no_of_rounds")
    private Integer noOfRounds;

    @Column(name = "no_of_players")
    private Integer noOfPlayers;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type")
    private RoomType roomType;

    @Column(name = "room_code")
    private Integer roomCode;

    @Column(name = "theme")
    private String theme;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rooms" }, allowSetters = true)
    private Player player;

    @ManyToOne
    @JsonIgnoreProperties(value = { "roundPrompt", "rooms" }, allowSetters = true)
    private Round round;

    @ManyToOne
    @JsonIgnoreProperties(value = { "rooms", "round" }, allowSetters = true)
    private RoundPrompt roundPrompt;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Room id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNoOfRounds() {
        return this.noOfRounds;
    }

    public Room noOfRounds(Integer noOfRounds) {
        this.setNoOfRounds(noOfRounds);
        return this;
    }

    public void setNoOfRounds(Integer noOfRounds) {
        this.noOfRounds = noOfRounds;
    }

    public Integer getNoOfPlayers() {
        return this.noOfPlayers;
    }

    public Room noOfPlayers(Integer noOfPlayers) {
        this.setNoOfPlayers(noOfPlayers);
        return this;
    }

    public void setNoOfPlayers(Integer noOfPlayers) {
        this.noOfPlayers = noOfPlayers;
    }

    public RoomType getRoomType() {
        return this.roomType;
    }

    public Room roomType(RoomType roomType) {
        this.setRoomType(roomType);
        return this;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public Integer getRoomCode() {
        return this.roomCode;
    }

    public Room roomCode(Integer roomCode) {
        this.setRoomCode(roomCode);
        return this;
    }

    public void setRoomCode(Integer roomCode) {
        this.roomCode = roomCode;
    }

    public String getTheme() {
        return this.theme;
    }

    public Room theme(String theme) {
        this.setTheme(theme);
        return this;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Player getPlayer() {
        return this.player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Room player(Player player) {
        this.setPlayer(player);
        return this;
    }

    public Round getRound() {
        return this.round;
    }

    public void setRound(Round round) {
        this.round = round;
    }

    public Room round(Round round) {
        this.setRound(round);
        return this;
    }

    public RoundPrompt getRoundPrompt() {
        return this.roundPrompt;
    }

    public void setRoundPrompt(RoundPrompt roundPrompt) {
        this.roundPrompt = roundPrompt;
    }

    public Room roundPrompt(RoundPrompt roundPrompt) {
        this.setRoundPrompt(roundPrompt);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Room)) {
            return false;
        }
        return id != null && id.equals(((Room) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Room{" +
            "id=" + getId() +
            ", noOfRounds=" + getNoOfRounds() +
            ", noOfPlayers=" + getNoOfPlayers() +
            ", roomType='" + getRoomType() + "'" +
            ", roomCode=" + getRoomCode() +
            ", theme='" + getTheme() + "'" +
            "}";
    }
}
