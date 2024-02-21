package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Prompt;

/**
 * Spring Data JPA repository for the Prompt entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PromptRepository extends JpaRepository<Prompt, Long> {}
