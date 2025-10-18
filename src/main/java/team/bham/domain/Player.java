package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Player.
 */
@Entity
@Table(name = "player")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Player implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "linked_user", unique = true)
    private Long linkedUser;

    @Column(name = "linked_room")
    private Long linkedRoom;

    @Column(name = "username")
    private String username;

    @Lob
    @Column(name = "drawing")
    private byte[] drawing;

    @Column(name = "drawing_content_type")
    private String drawingContentType;

    @Column(name = "total_stars")
    private Integer totalStars;

    @Column(name = "rank")
    private Integer rank;

    @OneToMany(mappedBy = "player")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "player", "round", "roundPrompt" }, allowSetters = true)
    private Set<Room> rooms = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Player id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLinkedUser() {
        return this.linkedUser;
    }

    public Player linkedUser(Long linkedUser) {
        this.setLinkedUser(linkedUser);
        return this;
    }

    public void setLinkedUser(Long linkedUser) {
        this.linkedUser = linkedUser;
    }

    public Long getLinkedRoom() {
        return this.linkedRoom;
    }

    public Player linkedRoom(Long linkedRoom) {
        this.setLinkedRoom(linkedRoom);
        return this;
    }

    public void setLinkedRoom(Long linkedRoom) {
        this.linkedRoom = linkedRoom;
    }

    public String getUsername() {
        return this.username;
    }

    public Player username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public byte[] getDrawing() {
        return this.drawing;
    }

    public Player drawing(byte[] drawing) {
        this.setDrawing(drawing);
        return this;
    }

    public void setDrawing(byte[] drawing) {
        this.drawing = drawing;
    }

    public String getDrawingContentType() {
        return this.drawingContentType;
    }

    public Player drawingContentType(String drawingContentType) {
        this.drawingContentType = drawingContentType;
        return this;
    }

    public void setDrawingContentType(String drawingContentType) {
        this.drawingContentType = drawingContentType;
    }

    public Integer getTotalStars() {
        return this.totalStars;
    }

    public Player totalStars(Integer totalStars) {
        this.setTotalStars(totalStars);
        return this;
    }

    public void setTotalStars(Integer totalStars) {
        this.totalStars = totalStars;
    }

    public Integer getRank() {
        return this.rank;
    }

    public Player rank(Integer rank) {
        this.setRank(rank);
        return this;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Set<Room> getRooms() {
        return this.rooms;
    }

    public void setRooms(Set<Room> rooms) {
        if (this.rooms != null) {
            this.rooms.forEach(i -> i.setPlayer(null));
        }
        if (rooms != null) {
            rooms.forEach(i -> i.setPlayer(this));
        }
        this.rooms = rooms;
    }

    public Player rooms(Set<Room> rooms) {
        this.setRooms(rooms);
        return this;
    }

    public Player addRoom(Room room) {
        this.rooms.add(room);
        room.setPlayer(this);
        return this;
    }

    public Player removeRoom(Room room) {
        this.rooms.remove(room);
        room.setPlayer(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Player)) {
            return false;
        }
        return id != null && id.equals(((Player) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Player{" +
            "id=" + getId() +
            ", linkedUser=" + getLinkedUser() +
            ", linkedRoom=" + getLinkedRoom() +
            ", username='" + getUsername() + "'" +
            ", drawing='" + getDrawing() + "'" +
            ", drawingContentType='" + getDrawingContentType() + "'" +
            ", totalStars=" + getTotalStars() +
            ", rank=" + getRank() +
            "}";
    }
}
