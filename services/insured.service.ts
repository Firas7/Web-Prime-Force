import axios from 'axios';
import { InsuredModel } from '~/models/insured.model';
import { Status } from '~/models/status.enum';
import { Moment, utc } from '~/node_modules/moment';
import { deserializeDates } from '~/services/serialization';

class InsuredService {
  private readonly API_URL: string = '/api/insured';

  private readonly access_token = localStorage.getItem('access_token');

  public async getInsured(
    beginAtIndex: number,
    limit: number
  ): Promise<InsuredModel[]> {
    return await axios
      .get<InsuredModel[]>(this.API_URL, {
        params: {
          beginAtIndex: beginAtIndex,
          limit: limit,
        },
      })
      .then((response) => {
        const data = response.data;
        data.map((insured: InsuredModel) => {
          return {
            ...insured,
            birthday: deserializeDates<InsuredModel, Moment>(
              [insured],
              ['birthday'],
              utc
            )[0],
          };
        });
        return data;
      });
  }

  public async getInsuredByID(id: string): Promise<InsuredModel> {
    return await axios.get(this.API_URL + '/' + id).then((response) => {
      const insured: InsuredModel = response.data;
      return insured;
    });
  }
  public async getInsuredByPartnerID(partnerId: string): Promise<InsuredModel> {
    return await axios
      .get(this.API_URL + '/pid/' + partnerId)
      .then((response) => {
        const insured: InsuredModel = response.data;
        return insured;
      });
  }
  public async getInsuredByPartnerIdInUser(
    partnerId: string
  ): Promise<InsuredModel> {
    return await axios
      .get('/api/insured/pidInUser/' + partnerId)
      .then((response) => {
        const insured: InsuredModel = response.data;
        return insured;
      });
  }

  public async getInsuredByUserPartnerID(
    partnerId: string
  ): Promise<InsuredModel> {
    return await axios
      .get(this.API_URL + '/pidInUser/' + partnerId)
      .then((response) => {
        const insured: InsuredModel = response.data;
        return insured;
      });
  }

  public async getInsuredToUserByPartnerID(
    partnerId: string
  ): Promise<InsuredModel> {
    return await axios
      .get(this.API_URL + '/pidInUser/' + partnerId)
      .then((response) => {
        const insured: InsuredModel = response.data;
        return insured;
      });
  }

  public async addInsured(insured: InsuredModel): Promise<Status> {
    return await axios.post(this.API_URL, insured).then((response) => {
      return response.status == 201 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
    });
  }

  public async deleteInsured(id: string): Promise<Status> {
    const httpResponse = await axios.delete(this.API_URL + '/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.access_token,
      },
    });

    if (httpResponse.status === 200) {
      return Status.SUCCESS;
    } else {
      return Status.UNKNOWN_ERROR;
    }
  }

  public async updateInsured(
    insured: InsuredModel,
    id: string
  ): Promise<Status> {
    delete insured._id;
    delete insured.clerkId;
    delete insured.agentId;
    delete insured.mandantenId;
    delete insured.partnerId;
    const httpResponse = await axios.put(this.API_URL + '/' + id, insured, {
      headers: {
        Authorization: 'Bearer ' + this.access_token,
      },
    });

    if (httpResponse.status === 200) {
      return Status.SUCCESS;
    } else {
      return Status.UNKNOWN_ERROR;
    }
  }
  public async updateInsuredByUser(insured: InsuredModel): Promise<Status> {
    delete insured._id;
    delete insured.clerkId;
    delete insured.agentId;
    delete insured.mandantenId;
    delete insured.partnerId;
    const httpResponse = await axios.put(this.API_URL + '/update', insured, {
      headers: {
        Authorization: 'Bearer ' + this.access_token,
      },
    });

    if (httpResponse.status === 200) {
      return Status.SUCCESS;
    } else {
      return Status.UNKNOWN_ERROR;
    }
  }
}

// Export a singleton instance in the global namespace
export const insuredService = new InsuredService();
