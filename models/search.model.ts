import { ClaimcaseModel } from '~/models/claimcase.model';
import { CONTRACT_EXAMPLE, ContractModel } from '~/models/contract.model';
import { INSURED_EXAMPLE, InsuredModel } from '~/models/insured.model';

export interface SearchModel {
  insured: InsuredModel;
  found?: string[];
  contracts?: ContractModel[];
  claimCases?: ClaimcaseModel[];
}

export interface SearchResult {
  time: number;
  length_total: number;
  length_page: number;
  result: SearchModel[];
}

export const SEARCH_MODEL_EXAMPLE: SearchModel = {
  insured: INSURED_EXAMPLE,
  found: ['name'],
  contracts: [CONTRACT_EXAMPLE],
  //claimCases: [CLAIMCASE_EXAMPLE],
};
