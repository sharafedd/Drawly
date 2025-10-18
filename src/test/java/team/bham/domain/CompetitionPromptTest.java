package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CompetitionPromptTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompetitionPrompt.class);
        CompetitionPrompt competitionPrompt1 = new CompetitionPrompt();
        competitionPrompt1.setId(1L);
        CompetitionPrompt competitionPrompt2 = new CompetitionPrompt();
        competitionPrompt2.setId(competitionPrompt1.getId());
        assertThat(competitionPrompt1).isEqualTo(competitionPrompt2);
        competitionPrompt2.setId(2L);
        assertThat(competitionPrompt1).isNotEqualTo(competitionPrompt2);
        competitionPrompt1.setId(null);
        assertThat(competitionPrompt1).isNotEqualTo(competitionPrompt2);
    }
}
