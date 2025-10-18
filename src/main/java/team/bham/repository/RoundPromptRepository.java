package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.RoundPrompt;

/**
 * Spring Data JPA repository for the RoundPrompt entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoundPromptRepository extends JpaRepository<RoundPrompt, Long> {}
