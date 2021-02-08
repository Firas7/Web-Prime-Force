import axios from 'axios';
import { ContractModel } from '~/models/contract.model';
import { Status } from '~/models/status.enum';
import { Moment, utc } from '~/node_modules/moment';
import { deserializeDates } from '~/services/serialization';

class ContractService {
  private readonly API_URL: string = '/api/contracts';

  public async getContracts(
    beginAtIndex: number,
    limit: number
  ): Promise<{ contracts: ContractModel[]; documents: number }> {
    return await axios
      .get<{ contracts: ContractModel[]; documents: number }>(this.API_URL, {
        params: {
          beginAtIndex: beginAtIndex,
          limit: limit,
        },
      })
      .then((response) => {
        const data = response.data.contracts;
        data.map((contract: ContractModel) => {
          return {
            ...contract,
            startdate: deserializeDates<ContractModel, Moment>(
              [contract],
              ['startdate'],
              utc
            )[0],
          };
        });
        let contracts = response.data.contracts;
        let documents = response.data.documents;
        return { contracts, documents };
      })
      .catch(() => {
        let contracts: ContractModel[] = [];
        let documents = 0;
        return { contracts, documents };
      });
  }

  public async getContractsByPartnerId(
    partnerId: string
  ): Promise<ContractModel[]> {
    return await axios
      .get<ContractModel[]>(this.API_URL + '/admin/' + partnerId)
      .then((response) => {
        const data = response.data;
        data.map((contract: ContractModel) => {
          return {
            ...contract,
            startdate: deserializeDates<ContractModel, Moment>(
              [contract],
              ['startdate'],
              utc
            )[0],
          };
        });
        return data;
      });
  }

  public async getUserContractsByPartnerId(
    partnerId: string
  ): Promise<ContractModel[]> {
    return await axios
      .get<ContractModel[]>(this.API_URL + '/user/' + partnerId)
      .then((response) => {
        const data = response.data;
        data.map((contract: ContractModel) => {
          return {
            ...contract,
            startdate: deserializeDates<ContractModel, Moment>(
              [contract],
              ['startdate'],
              utc
            )[0],
          };
        });
        return data;
      });
  }

  public async getContractById(contractId: string): Promise<ContractModel[]> {
    return await axios
      .get<ContractModel[]>(this.API_URL + '/' + contractId)
      .then((response) => {
        const data = response.data;
        data.map((contract: ContractModel) => {
          return {
            ...contract,
            startdate: deserializeDates<ContractModel, Moment>(
              [contract],
              ['startdate'],
              utc
            )[0],
          };
        });
        return data;
      });
  }

  public async addContract(contract: ContractModel): Promise<Status> {
    return await axios.post(this.API_URL, contract).then((response) => {
      return response.status === 201 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
    });
  }

  public async deleteContract(id: string): Promise<Status> {
    return await axios.delete(this.API_URL + '/' + id).then((response) => {
      return response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
    });
  }

  public async editContract(
    id: string,
    contract: ContractModel
  ): Promise<Status> {
    return await axios
      .put(this.API_URL + '/' + id, contract)
      .then((response) => {
        return response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
      });
  }
}

export const contractService = new ContractService();
