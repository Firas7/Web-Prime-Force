import axios from 'axios';
import { TenantModel } from '~/models/tenant.model';
import { Status } from '~/models/status.enum';

class TenantService {
  private readonly API_URL: string = '/api/tenants';

  public async getTenants(
    beginAtIndex: number,
    limit: number
  ): Promise<{ tenants: TenantModel[]; documents: number }> {
    return await axios
      .get<{ tenants: TenantModel[]; documents: number }>(this.API_URL, {
        params: {
          beginAtIndex: beginAtIndex,
          limit: limit,
        },
      })
      .then((response) => {
        let tenants = response.data.tenants;
        let documents = response.data.documents;
        return { tenants, documents };
      })
      .catch(() => {
        let tenants: TenantModel[] = [];
        let documents = 0;
        return { tenants, documents };
      });
  }

  public async addTenant(tenant: TenantModel): Promise<Status> {
    return await axios.post(this.API_URL, tenant).then((response) => {
      return response.status === 201 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
    });
  }

  public async deleteTenant(id: string): Promise<Status> {
    return await axios.delete(this.API_URL + '/' + id).then((response) => {
      return response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
    });
  }

  public async editTenant(id: string, tenant: TenantModel): Promise<Status> {
    return await axios.put(this.API_URL + '/' + id, tenant).then((response) => {
      return response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
    });
  }
}

// Export a singleton instance in the global namespace
export const tenantService = new TenantService();
