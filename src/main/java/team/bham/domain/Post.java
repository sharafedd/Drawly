package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
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

    @Column(name = "post_id")
    private Integer postID;

    @Column(name = "linked_prompt")
    private Integer linkedPrompt;

    @Column(name = "linked_user")
    private Integer linkedUser;

    @Lob
    @Column(name = "post_content")
    private byte[] postContent;

    @Column(name = "post_content_content_type")
    private String postContentContentType;

    @Column(name = "avergae_star")
    private Float avergaeStar;

    @OneToMany(mappedBy = "post")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "post" }, allowSetters = true)
    private Set<Prompt> prompts = new HashSet<>();

    @ManyToOne
    private User user;

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

    public Integer getPostID() {
        return this.postID;
    }

    public Post postID(Integer postID) {
        this.setPostID(postID);
        return this;
    }

    public void setPostID(Integer postID) {
        this.postID = postID;
    }

    public Integer getLinkedPrompt() {
        return this.linkedPrompt;
    }

    public Post linkedPrompt(Integer linkedPrompt) {
        this.setLinkedPrompt(linkedPrompt);
        return this;
    }

    public void setLinkedPrompt(Integer linkedPrompt) {
        this.linkedPrompt = linkedPrompt;
    }

    public Integer getLinkedUser() {
        return this.linkedUser;
    }

    public Post linkedUser(Integer linkedUser) {
        this.setLinkedUser(linkedUser);
        return this;
    }

    public void setLinkedUser(Integer linkedUser) {
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

    public Float getAvergaeStar() {
        return this.avergaeStar;
    }

    public Post avergaeStar(Float avergaeStar) {
        this.setAvergaeStar(avergaeStar);
        return this;
    }

    public void setAvergaeStar(Float avergaeStar) {
        this.avergaeStar = avergaeStar;
    }

    public Set<Prompt> getPrompts() {
        return this.prompts;
    }

    public void setPrompts(Set<Prompt> prompts) {
        if (this.prompts != null) {
            this.prompts.forEach(i -> i.setPost(null));
        }
        if (prompts != null) {
            prompts.forEach(i -> i.setPost(this));
        }
        this.prompts = prompts;
    }

    public Post prompts(Set<Prompt> prompts) {
        this.setPrompts(prompts);
        return this;
    }

    public Post addPrompt(Prompt prompt) {
        this.prompts.add(prompt);
        prompt.setPost(this);
        return this;
    }

    public Post removePrompt(Prompt prompt) {
        this.prompts.remove(prompt);
        prompt.setPost(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Post user(User user) {
        this.setUser(user);
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
            ", postID=" + getPostID() +
            ", linkedPrompt=" + getLinkedPrompt() +
            ", linkedUser=" + getLinkedUser() +
            ", postContent='" + getPostContent() + "'" +
            ", postContentContentType='" + getPostContentContentType() + "'" +
            ", avergaeStar=" + getAvergaeStar() +
            "}";
    }
}
