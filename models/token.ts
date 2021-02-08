export interface Token {
  registerToken?: string;
  linkTokenExpiryDate?: number;
  linkUserInsuredToken?: any;
}

export const TOKEN_EXAMPLE: Token = {
  registerToken: '$2b$10$1kbeJM65mRVIUX./pARHJ.e0gdjyT.JStH7eXQx2ecu.cM2X88bsG',
  linkTokenExpiryDate: 1574525007823,
  linkUserInsuredToken: null,
};
