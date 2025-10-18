package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Post.
 */
@Entity
@Table(name = "post")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "linked_prompt")
    private Long linkedPrompt;

    @Column(name = "linked_user")
    private Long linkedUser;

    @Lob
    @Column(name = "post_content")
    private byte[] postContent;

    @Column(name = "post_content_content_type")
    private String postContentContentType;

    @Column(name = "average_star")
    private Float averageStar;

    @Column(name = "submission_date")
    private Instant submissionDate;

    @OneToMany(mappedBy = "post")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "competition", "post" }, allowSetters = true)
    private Set<CompetitionPrompt> competitionPrompts = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "posts" }, allowSetters = true)
    private Comment comment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Post id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLinkedPrompt() {
        return this.linkedPrompt;
    }

    public Post linkedPrompt(Long linkedPrompt) {
        this.setLinkedPrompt(linkedPrompt);
        return this;
    }

    public void setLinkedPrompt(Long linkedPrompt) {
        this.linkedPrompt = linkedPrompt;
    }

    public Long getLinkedUser() {
        return this.linkedUser;
    }

    public Post linkedUser(Long linkedUser) {
        this.setLinkedUser(linkedUser);
        return this;
    }

    public void setLinkedUser(Long linkedUser) {
        this.linkedUser = linkedUser;
    }

    public byte[] getPostContent() {
        return this.postContent;
    }

    public Post postContent(byte[] postContent) {
        this.setPostContent(postContent);
        return this;
    }

    public void setPostContent(byte[] postContent) {
        this.postContent = postContent;
    }

    public String getPostContentContentType() {
        return this.postContentContentType;
    }

    public Post postContentContentType(String postContentContentType) {
        this.postContentContentType = postContentContentType;
        return this;
    }

    public void setPostContentContentType(String postContentContentType) {
        this.postContentContentType = postContentContentType;
    }

    public Float getAverageStar() {
        return this.averageStar;
    }

    public Post averageStar(Float averageStar) {
        this.setAverageStar(averageStar);
        return this;
    }

    public void setAverageStar(Float averageStar) {
        this.averageStar = averageStar;
    }

    public Instant getSubmissionDate() {
        return this.submissionDate;
    }

    public Post submissionDate(Instant submissionDate) {
        this.setSubmissionDate(submissionDate);
        return this;
    }

    public void setSubmissionDate(Instant submissionDate) {
        this.submissionDate = submissionDate;
    }

    public Set<CompetitionPrompt> getCompetitionPrompts() {
        return this.competitionPrompts;
    }

    public void setCompetitionPrompts(Set<CompetitionPrompt> competitionPrompts) {
        if (this.competitionPrompts != null) {
            this.competitionPrompts.forEach(i -> i.setPost(null));
        }
        if (competitionPrompts != null) {
            competitionPrompts.forEach(i -> i.setPost(this));
        }
        this.competitionPrompts = competitionPrompts;
    }

    public Post competitionPrompts(Set<CompetitionPrompt> competitionPrompts) {
        this.setCompetitionPrompts(competitionPrompts);
        return this;
    }

    public Post addCompetitionPrompt(CompetitionPrompt competitionPrompt) {
        this.competitionPrompts.add(competitionPrompt);
        competitionPrompt.setPost(this);
        return this;
    }

    public Post removeCompetitionPrompt(CompetitionPrompt competitionPrompt) {
        this.competitionPrompts.remove(competitionPrompt);
        competitionPrompt.setPost(null);
        return this;
    }

    public Comment getComment() {
        return this.comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public Post comment(Comment comment) {
        this.setComment(comment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Post)) {
            return false;
        }
        return id != null && id.equals(((Post) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Post{" +
            "id=" + getId() +
            ", linkedPrompt=" + getLinkedPrompt() +
            ", linkedUser=" + getLinkedUser() +
            ", postContent='" + getPostContent() + "'" +
            ", postContentContentType='" + getPostContentContentType() + "'" +
            ", averageStar=" + getAverageStar() +
            ", submissionDate='" + getSubmissionDate() + "'" +
            "}";
    }
}
