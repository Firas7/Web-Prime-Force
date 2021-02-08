import { Component, Vue } from 'vue-property-decorator';
import { AgentModel } from '~/models/agent.model';

@Component
export default class InsuredAgent extends Vue {
  get agent(): AgentModel {
    return this.$accessor.agent.agent;
  }

  created() {
    if (!!this.$accessor.user.getPartnerID) {
      this.$accessor.agent.fetchAgentByPartnerId(
        this.$accessor.user.getPartnerID
      );
    }
  }
}
