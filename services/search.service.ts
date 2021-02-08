import axios from 'axios';
import { SearchResult } from '../models/search.model';

class SearchService {
  private readonly API_URL: string = '/api/search/';

  private readonly access_token = localStorage.getItem('access_token');

  public async getSearchResults(
    searchTerm: string,
    beginAtIndex: number,
    limit: number
  ): Promise<SearchResult> {
    return await axios
      .get<SearchResult>(this.API_URL + searchTerm, {
        params: {
          beginAtIndex: beginAtIndex,
          limit: limit,
        },
      })
      .then((response) => {
        const data = response.data;
        /*data.map((insured: SearchModel) => {
                return {
                    ...insured,
                    birthday: deserializeDates<SearchModel, Moment>([insured], ['birthday'], utc)[0],
                }
            });*/
        return data;
      });
  }
}

// Export a singleton instance in the global namespace
export const searchService = new SearchService();
