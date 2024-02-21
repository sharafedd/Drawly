package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PromptTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Prompt.class);
        Prompt prompt1 = new Prompt();
        prompt1.setId(1L);
        Prompt prompt2 = new Prompt();
        prompt2.setId(prompt1.getId());
        assertThat(prompt1).isEqualTo(prompt2);
        prompt2.setId(2L);
        assertThat(prompt1).isNotEqualTo(prompt2);
        prompt1.setId(null);
        assertThat(prompt1).isNotEqualTo(prompt2);
    }
}
