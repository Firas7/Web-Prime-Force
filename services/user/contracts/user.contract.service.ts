import axios from 'axios';
import { ContractModel } from '~/models/contract.model';
import { state } from '~/store/accessToken';

class UserContractService {
  private readonly API_URL: string = '/api/insured/contracts/';

  public async getContracts(id: string): Promise<ContractModel[]> {
    const httpResponse = await axios.get<ContractModel[]>(this.API_URL + id, {
      headers: { Authorization: 'Bearer ' + state },
    });
    return httpResponse.data;
  }
}

export const userContractService = new UserContractService();
