package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Round.
 */
@Entity
@Table(name = "round")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Round implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "linked_prompt")
    private Long linkedPrompt;

    @Column(name = "linked_room")
    private Long linkedRoom;

    @Column(name = "round_number")
    private Integer roundNumber;

    @JsonIgnoreProperties(value = { "rooms", "round" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private RoundPrompt roundPrompt;

    @OneToMany(mappedBy = "round")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "player", "round", "roundPrompt" }, allowSetters = true)
    private Set<Room> rooms = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Round id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLinkedPrompt() {
        return this.linkedPrompt;
    }

    public Round linkedPrompt(Long linkedPrompt) {
        this.setLinkedPrompt(linkedPrompt);
        return this;
    }

    public void setLinkedPrompt(Long linkedPrompt) {
        this.linkedPrompt = linkedPrompt;
    }

    public Long getLinkedRoom() {
        return this.linkedRoom;
    }

    public Round linkedRoom(Long linkedRoom) {
        this.setLinkedRoom(linkedRoom);
        return this;
    }

    public void setLinkedRoom(Long linkedRoom) {
        this.linkedRoom = linkedRoom;
    }

    public Integer getRoundNumber() {
        return this.roundNumber;
    }

    public Round roundNumber(Integer roundNumber) {
        this.setRoundNumber(roundNumber);
        return this;
    }

    public void setRoundNumber(Integer roundNumber) {
        this.roundNumber = roundNumber;
    }

    public RoundPrompt getRoundPrompt() {
        return this.roundPrompt;
    }

    public void setRoundPrompt(RoundPrompt roundPrompt) {
        this.roundPrompt = roundPrompt;
    }

    public Round roundPrompt(RoundPrompt roundPrompt) {
        this.setRoundPrompt(roundPrompt);
        return this;
    }

    public Set<Room> getRooms() {
        return this.rooms;
    }

    public void setRooms(Set<Room> rooms) {
        if (this.rooms != null) {
            this.rooms.forEach(i -> i.setRound(null));
        }
        if (rooms != null) {
            rooms.forEach(i -> i.setRound(this));
        }
        this.rooms = rooms;
    }

    public Round rooms(Set<Room> rooms) {
        this.setRooms(rooms);
        return this;
    }

    public Round addRoom(Room room) {
        this.rooms.add(room);
        room.setRound(this);
        return this;
    }

    public Round removeRoom(Room room) {
        this.rooms.remove(room);
        room.setRound(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Round)) {
            return false;
        }
        return id != null && id.equals(((Round) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Round{" +
            "id=" + getId() +
            ", linkedPrompt=" + getLinkedPrompt() +
            ", linkedRoom=" + getLinkedRoom() +
            ", roundNumber=" + getRoundNumber() +
            "}";
    }
}
