package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CompetitionPrompt.
 */
@Entity
@Table(name = "competition_prompt")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CompetitionPrompt implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "linked_competition")
    private Long linkedCompetition;

    @Column(name = "prompt_content")
    private String promptContent;

    @JsonIgnoreProperties(value = { "competitionPrompt" }, allowSetters = true)
    @OneToOne(mappedBy = "competitionPrompt")
    private Competition competition;

    @ManyToOne
    @JsonIgnoreProperties(value = { "competitionPrompts", "comment" }, allowSetters = true)
    private Post post;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CompetitionPrompt id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLinkedCompetition() {
        return this.linkedCompetition;
    }

    public CompetitionPrompt linkedCompetition(Long linkedCompetition) {
        this.setLinkedCompetition(linkedCompetition);
        return this;
    }

    public void setLinkedCompetition(Long linkedCompetition) {
        this.linkedCompetition = linkedCompetition;
    }

    public String getPromptContent() {
        return this.promptContent;
    }

    public CompetitionPrompt promptContent(String promptContent) {
        this.setPromptContent(promptContent);
        return this;
    }

    public void setPromptContent(String promptContent) {
        this.promptContent = promptContent;
    }

    public Competition getCompetition() {
        return this.competition;
    }

    public void setCompetition(Competition competition) {
        if (this.competition != null) {
            this.competition.setCompetitionPrompt(null);
        }
        if (competition != null) {
            competition.setCompetitionPrompt(this);
        }
        this.competition = competition;
    }

    public CompetitionPrompt competition(Competition competition) {
        this.setCompetition(competition);
        return this;
    }

    public Post getPost() {
        return this.post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public CompetitionPrompt post(Post post) {
        this.setPost(post);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CompetitionPrompt)) {
            return false;
        }
        return id != null && id.equals(((CompetitionPrompt) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CompetitionPrompt{" +
            "id=" + getId() +
            ", linkedCompetition=" + getLinkedCompetition() +
            ", promptContent='" + getPromptContent() + "'" +
            "}";
    }
}
