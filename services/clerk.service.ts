import axios from 'axios';
import { ClerkModel } from '~/models/clerk.model';

class ClerkService {
  private readonly API_URL: string = '/api/clerk';

  public async getClerkByPartnerId(partnerId: string): Promise<ClerkModel> {
    return await axios.get(this.API_URL + '/' + partnerId).then((response) => {
      const clerk: ClerkModel = response.data;
      return clerk;
    });
  }
  public async getClerkProfilePicByUserId(userId: string): Promise<string> {
    return await axios.get(this.API_URL + '/' + userId).then((response) => {
      const clerk: ClerkModel = response.data;
      return clerk.faceImage;
    });
  }
}

export const clerkService = new ClerkService();
