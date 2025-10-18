package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CompetitionPrompt;

/**
 * Spring Data JPA repository for the CompetitionPrompt entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompetitionPromptRepository extends JpaRepository<CompetitionPrompt, Long> {}
