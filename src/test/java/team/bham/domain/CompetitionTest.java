package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CompetitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Competition.class);
        Competition competition1 = new Competition();
        competition1.setId(1L);
        Competition competition2 = new Competition();
        competition2.setId(competition1.getId());
        assertThat(competition1).isEqualTo(competition2);
        competition2.setId(2L);
        assertThat(competition1).isNotEqualTo(competition2);
        competition1.setId(null);
        assertThat(competition1).isNotEqualTo(competition2);
    }
}
