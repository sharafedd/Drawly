package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Competition.
 */
@Entity
@Table(name = "competition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Competition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "comp_type")
    private Boolean compType;

    @Column(name = "total_participants")
    private Integer totalParticipants;

    @JsonIgnoreProperties(value = { "post" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Prompt prompt;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Competition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getCompType() {
        return this.compType;
    }

    public Competition compType(Boolean compType) {
        this.setCompType(compType);
        return this;
    }

    public void setCompType(Boolean compType) {
        this.compType = compType;
    }

    public Integer getTotalParticipants() {
        return this.totalParticipants;
    }

    public Competition totalParticipants(Integer totalParticipants) {
        this.setTotalParticipants(totalParticipants);
        return this;
    }

    public void setTotalParticipants(Integer totalParticipants) {
        this.totalParticipants = totalParticipants;
    }

    public Prompt getPrompt() {
        return this.prompt;
    }

    public void setPrompt(Prompt prompt) {
        this.prompt = prompt;
    }

    public Competition prompt(Prompt prompt) {
        this.setPrompt(prompt);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Competition)) {
            return false;
        }
        return id != null && id.equals(((Competition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Competition{" +
            "id=" + getId() +
            ", compType='" + getCompType() + "'" +
            ", totalParticipants=" + getTotalParticipants() +
            "}";
    }
}
