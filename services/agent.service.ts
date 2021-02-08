import axios from 'axios';
import { AgentModel } from '~/models/agent.model';

class AgentService {
  private readonly API_URL: string = '/api/agent';

  public async getAgentByPartnerId(partnerId: string): Promise<AgentModel> {
    return await axios.get(this.API_URL + '/' + partnerId).then((response) => {
      const agent: AgentModel = response.data;
      return agent;
    });
  }
}

export const agentService = new AgentService();
