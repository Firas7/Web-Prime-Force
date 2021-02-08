import { LINKEDPARTNER_EXAMPLE } from '~/models/linked-partner.model';
import { Moment, utc } from '~/node_modules/moment';
import { Branch } from './branch-form/branch.enum';
import { AuthModel } from './auth.enum';

export interface ContractModel {
  _id: string;
  insurancepapernumber: string;
  branch: Branch;
  productname: string;
  startdate: Moment;
  linkedPartnerId: string;
  partnerId: string;
  auth?: AuthModel;
}

export const CONTRACT_EXAMPLE: ContractModel = {
  _id: '507f1f77bcf86cg799439013',
  insurancepapernumber: '1223412',
  branch: Branch.Test,
  productname: 'Teilkasko',
  startdate: utc('25.02.1996'),
  linkedPartnerId: LINKEDPARTNER_EXAMPLE.partnerId,
  partnerId: LINKEDPARTNER_EXAMPLE.partnerId,
};
