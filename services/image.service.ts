import axios from 'axios';

class ImageService {
  private readonly API_URL: string = '/api/image';

  public async getImageByClaimAndImageId(
    claimId: string | undefined,
    imageId: string
  ): Promise<File> {
    return await axios
      .get('/api/claim/case/getImage/' + claimId + '/' + imageId)
      .then((response) => {
        const image: File = response.data;
        return image;
      });
  }
}

export const imageService = new ImageService();
