package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Prompt.
 */
@Entity
@Table(name = "prompt")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Prompt implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "prompt_id")
    private Integer promptID;

    @Column(name = "prompt_content")
    private String promptContent;

    @Column(name = "prompt_deadline")
    private ZonedDateTime promptDeadline;

    @Column(name = "participants_num")
    private Integer participantsNum;

    @ManyToOne
    @JsonIgnoreProperties(value = { "competitionPrompts", "comment" }, allowSetters = true)
    private Post post;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Prompt id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPromptID() {
        return this.promptID;
    }

    public Prompt promptID(Integer promptID) {
        this.setPromptID(promptID);
        return this;
    }

    public void setPromptID(Integer promptID) {
        this.promptID = promptID;
    }

    public String getPromptContent() {
        return this.promptContent;
    }

    public Prompt promptContent(String promptContent) {
        this.setPromptContent(promptContent);
        return this;
    }

    public void setPromptContent(String promptContent) {
        this.promptContent = promptContent;
    }

    public ZonedDateTime getPromptDeadline() {
        return this.promptDeadline;
    }

    public Prompt promptDeadline(ZonedDateTime promptDeadline) {
        this.setPromptDeadline(promptDeadline);
        return this;
    }

    public void setPromptDeadline(ZonedDateTime promptDeadline) {
        this.promptDeadline = promptDeadline;
    }

    public Integer getParticipantsNum() {
        return this.participantsNum;
    }

    public Prompt participantsNum(Integer participantsNum) {
        this.setParticipantsNum(participantsNum);
        return this;
    }

    public void setParticipantsNum(Integer participantsNum) {
        this.participantsNum = participantsNum;
    }

    public Post getPost() {
        return this.post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Prompt post(Post post) {
        this.setPost(post);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Prompt)) {
            return false;
        }
        return id != null && id.equals(((Prompt) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Prompt{" +
            "id=" + getId() +
            ", promptID=" + getPromptID() +
            ", promptContent='" + getPromptContent() + "'" +
            ", promptDeadline='" + getPromptDeadline() + "'" +
            ", participantsNum=" + getParticipantsNum() +
            "}";
    }
}
