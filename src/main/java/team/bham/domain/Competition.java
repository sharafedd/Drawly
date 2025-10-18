package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.CompetitionType;

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

    @Column(name = "linked_prompt")
    private Long linkedPrompt;

    @Enumerated(EnumType.STRING)
    @Column(name = "competition_type")
    private CompetitionType competitionType;

    @Column(name = "no_of_participants")
    private Long noOfParticipants;

    @JsonIgnoreProperties(value = { "competition", "post" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private CompetitionPrompt competitionPrompt;

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

    public Long getLinkedPrompt() {
        return this.linkedPrompt;
    }

    public Competition linkedPrompt(Long linkedPrompt) {
        this.setLinkedPrompt(linkedPrompt);
        return this;
    }

    public void setLinkedPrompt(Long linkedPrompt) {
        this.linkedPrompt = linkedPrompt;
    }

    public CompetitionType getCompetitionType() {
        return this.competitionType;
    }

    public Competition competitionType(CompetitionType competitionType) {
        this.setCompetitionType(competitionType);
        return this;
    }

    public void setCompetitionType(CompetitionType competitionType) {
        this.competitionType = competitionType;
    }

    public Long getNoOfParticipants() {
        return this.noOfParticipants;
    }

    public Competition noOfParticipants(Long noOfParticipants) {
        this.setNoOfParticipants(noOfParticipants);
        return this;
    }

    public void setNoOfParticipants(Long noOfParticipants) {
        this.noOfParticipants = noOfParticipants;
    }

    public CompetitionPrompt getCompetitionPrompt() {
        return this.competitionPrompt;
    }

    public void setCompetitionPrompt(CompetitionPrompt competitionPrompt) {
        this.competitionPrompt = competitionPrompt;
    }

    public Competition competitionPrompt(CompetitionPrompt competitionPrompt) {
        this.setCompetitionPrompt(competitionPrompt);
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
            ", linkedPrompt=" + getLinkedPrompt() +
            ", competitionType='" + getCompetitionType() + "'" +
            ", noOfParticipants=" + getNoOfParticipants() +
            "}";
    }
}
