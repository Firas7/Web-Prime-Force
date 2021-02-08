import { LinkedPartner } from '~/models/linked-partner.model';
import { ProfileModel } from '~/models/profile.model';
import { Status } from '~/models/status.enum';
import { UserModel } from '~/models/user.model';
import axios from '~/node_modules/axios';

class UserService {
  private readonly API_URL: string = '/api';

  public async getUser(id: string): Promise<UserModel> {
    return await axios
      .get<UserModel>(this.API_URL + '/profile/' + id)
      .then((response) => response.data);
  }

  public async getUserName(id: string): Promise<string> {
    return await axios
      .get<UserModel>(this.API_URL + '/profile/' + id)
      .then(
        (response) =>
          response.data.coredata.firstname +
          ' ' +
          response.data.coredata.lastname
      );
  }

  public async linkPartnerId(id: string): Promise<number> {
    return await axios
      .post<LinkedPartner>(this.API_URL + '/insured/link', { partnerId: id })
      .then((response) => response.status);
  }

  public async confirmPartnerId(id: string): Promise<number> {
    return await axios
      .post<String>(this.API_URL + '/insured/link/confirm', { linkToken: id })
      .then((response) => response.status);
  }

  public async updateUser(profile: ProfileModel): Promise<Status> {
    return await axios
      .put(this.API_URL + '/profile/' + profile._id, profile)
      .then((response) =>
        response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR
      );
  }
}

export const userService = new UserService();
