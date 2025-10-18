package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RoundPrompt.
 */
@Entity
@Table(name = "round_prompt")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RoundPrompt implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "linked_room")
    private Long linkedRoom;

    @Column(name = "linked_round")
    private Long linkedRound;

    @Column(name = "content")
    private String content;

    @OneToMany(mappedBy = "roundPrompt")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "player", "round", "roundPrompt" }, allowSetters = true)
    private Set<Room> rooms = new HashSet<>();

    @JsonIgnoreProperties(value = { "roundPrompt", "rooms" }, allowSetters = true)
    @OneToOne(mappedBy = "roundPrompt")
    private Round round;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RoundPrompt id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLinkedRoom() {
        return this.linkedRoom;
    }

    public RoundPrompt linkedRoom(Long linkedRoom) {
        this.setLinkedRoom(linkedRoom);
        return this;
    }

    public void setLinkedRoom(Long linkedRoom) {
        this.linkedRoom = linkedRoom;
    }

    public Long getLinkedRound() {
        return this.linkedRound;
    }

    public RoundPrompt linkedRound(Long linkedRound) {
        this.setLinkedRound(linkedRound);
        return this;
    }

    public void setLinkedRound(Long linkedRound) {
        this.linkedRound = linkedRound;
    }

    public String getContent() {
        return this.content;
    }

    public RoundPrompt content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Set<Room> getRooms() {
        return this.rooms;
    }

    public void setRooms(Set<Room> rooms) {
        if (this.rooms != null) {
            this.rooms.forEach(i -> i.setRoundPrompt(null));
        }
        if (rooms != null) {
            rooms.forEach(i -> i.setRoundPrompt(this));
        }
        this.rooms = rooms;
    }

    public RoundPrompt rooms(Set<Room> rooms) {
        this.setRooms(rooms);
        return this;
    }

    public RoundPrompt addRoom(Room room) {
        this.rooms.add(room);
        room.setRoundPrompt(this);
        return this;
    }

    public RoundPrompt removeRoom(Room room) {
        this.rooms.remove(room);
        room.setRoundPrompt(null);
        return this;
    }

    public Round getRound() {
        return this.round;
    }

    public void setRound(Round round) {
        if (this.round != null) {
            this.round.setRoundPrompt(null);
        }
        if (round != null) {
            round.setRoundPrompt(this);
        }
        this.round = round;
    }

    public RoundPrompt round(Round round) {
        this.setRound(round);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RoundPrompt)) {
            return false;
        }
        return id != null && id.equals(((RoundPrompt) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RoundPrompt{" +
            "id=" + getId() +
            ", linkedRoom=" + getLinkedRoom() +
            ", linkedRound=" + getLinkedRound() +
            ", content='" + getContent() + "'" +
            "}";
    }
}
