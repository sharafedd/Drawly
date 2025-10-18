package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class RoundPromptTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RoundPrompt.class);
        RoundPrompt roundPrompt1 = new RoundPrompt();
        roundPrompt1.setId(1L);
        RoundPrompt roundPrompt2 = new RoundPrompt();
        roundPrompt2.setId(roundPrompt1.getId());
        assertThat(roundPrompt1).isEqualTo(roundPrompt2);
        roundPrompt2.setId(2L);
        assertThat(roundPrompt1).isNotEqualTo(roundPrompt2);
        roundPrompt1.setId(null);
        assertThat(roundPrompt1).isNotEqualTo(roundPrompt2);
    }
}
