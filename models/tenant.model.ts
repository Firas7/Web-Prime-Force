export interface TenantModel {
  _id: string;
  firstname: string;
  lastname: string;
  url?: string;
  pathname?: string;
}

export const TENANT_EXAMPLE: TenantModel = {
  _id: '5dd804d569537f0009aaec34',
  firstname: 'Test',
  lastname: 'Test',
};
