import axios from 'axios';
import { ProfileModel } from '~/models/profile.model';
import { Status } from '~/models/status.enum';

class ProfileService {
  private readonly API_URL: string = '/api/profile/';

  public async updateProfile(profile: ProfileModel): Promise<Status> {
    const response = await axios.put(this.API_URL + profile._id, profile);
    if (response.status === 200) {
      return Status.SUCCESS;
    } else {
      return Status.UNKNOWN_ERROR;
    }
  }

  public async getProfile(id: string): Promise<ProfileModel> {
    const response = await axios.get<ProfileModel>(this.API_URL + id);
    return response.data;
  }
}

export const profile_service = new ProfileService();
