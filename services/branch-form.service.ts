import axios from 'axios';
import {
  BranchFormModel,
  BranchFormAnswerModel,
} from '~/models/branch-form/branch-form.model';
import { Status } from '~/models/status.enum';

class BranchFormService {
  private readonly API_URL: string = '/api/form';

  public async getBranchFormByVersion(
    branch: string,
    version: string
  ): Promise<BranchFormModel> {
    return await axios
      .get(this.API_URL + '/' + branch + '/' + version)
      .then((response) => {
        const branchForm: BranchFormModel = response.data;
        return branchForm;
      });
  }

  public async postClaimResponse(
    response: BranchFormAnswerModel
  ): Promise<{ id: string; status: Status }> {
    const res = await axios.post(
      this.API_URL + '/' + response.branch + '/' + response.version,
      response
    );

    let id = res.data['id'];
    let status: Status =
      res.status == 201 ? Status.SUCCESS : Status.UNKNOWN_ERROR;

    return { id, status };
  }
  public async postClaimResponseAsAdmin(
    response: BranchFormAnswerModel
  ): Promise<{ id: string; status: Status }> {
    const res = await axios.post(
      this.API_URL + '/admin/' + response.branch + '/' + response.version,
      response
    );

    let id = res.data['id'];
    let status: Status =
      res.status == 201 ? Status.SUCCESS : Status.UNKNOWN_ERROR;

    return { id, status };
  }

  public async putClaimResponse(
    response: BranchFormAnswerModel
  ): Promise<Status> {
    const res = await axios.put('/api/claim/' + response.secret, response);

    return res.status == 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
  }

  public async fetchClaim(secret: string): Promise<BranchFormAnswerModel> {
    return await axios.get('/api/claim/' + secret).then((response) => {
      const claim: BranchFormAnswerModel = response.data;
      return claim;
    });
  }

  public async fetchClaimById(id: string): Promise<BranchFormAnswerModel> {
    return await axios.get('/api/claim/case/id/' + id).then((response) => {
      const claim: BranchFormAnswerModel = response.data;
      return claim;
    });
  }

  public async fetchClaimByPartnerId(
    partnerId: string
  ): Promise<BranchFormAnswerModel[]> {
    return await axios.get('/api/claim/case/' + partnerId).then((response) => {
      return response.data;
    });
  }
}

export const branchFormService = new BranchFormService();
