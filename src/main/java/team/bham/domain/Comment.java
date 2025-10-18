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
 * A Comment.
 */
@Entity
@Table(name = "comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "linked_post")
    private Long linkedPost;

    @Column(name = "linked_user")
    private Long linkedUser;

    @Column(name = "content")
    private String content;

    @Column(name = "timestamp")
    private Instant timestamp;

    @OneToMany(mappedBy = "comment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "competitionPrompts", "comment" }, allowSetters = true)
    private Set<Post> posts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Comment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLinkedPost() {
        return this.linkedPost;
    }

    public Comment linkedPost(Long linkedPost) {
        this.setLinkedPost(linkedPost);
        return this;
    }

    public void setLinkedPost(Long linkedPost) {
        this.linkedPost = linkedPost;
    }

    public Long getLinkedUser() {
        return this.linkedUser;
    }

    public Comment linkedUser(Long linkedUser) {
        this.setLinkedUser(linkedUser);
        return this;
    }

    public void setLinkedUser(Long linkedUser) {
        this.linkedUser = linkedUser;
    }

    public String getContent() {
        return this.content;
    }

    public Comment content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public Comment timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Set<Post> getPosts() {
        return this.posts;
    }

    public void setPosts(Set<Post> posts) {
        if (this.posts != null) {
            this.posts.forEach(i -> i.setComment(null));
        }
        if (posts != null) {
            posts.forEach(i -> i.setComment(this));
        }
        this.posts = posts;
    }

    public Comment posts(Set<Post> posts) {
        this.setPosts(posts);
        return this;
    }

    public Comment addPost(Post post) {
        this.posts.add(post);
        post.setComment(this);
        return this;
    }

    public Comment removePost(Post post) {
        this.posts.remove(post);
        post.setComment(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comment)) {
            return false;
        }
        return id != null && id.equals(((Comment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", linkedPost=" + getLinkedPost() +
            ", linkedUser=" + getLinkedUser() +
            ", content='" + getContent() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
