package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Round;

/**
 * Spring Data JPA repository for the Round entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoundRepository extends JpaRepository<Round, Long> {}
