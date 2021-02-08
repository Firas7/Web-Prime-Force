import { COREDATA_EXAMPLE, CoredataModel } from '~/models/coredata.model';
import {
  LinkedPartner,
  LINKEDPARTNER_EXAMPLE,
} from '~/models/linked-partner.model';
import { Token } from '~/models/token';
import { UserGroup } from '~/models/user-group.enum';
import { AuthModel } from './auth.enum';

export interface UserModel {
  _id: string;
  coredata: CoredataModel;
  email: string;
  valid: boolean;
  scope: UserGroup[];
  token?: Token;
  linkedPartner?: LinkedPartner;
  auth?: AuthModel;
}

export const USER_EXAMPLE: UserModel = {
  _id: '507f1f77bcf86cd799439011',
  coredata: COREDATA_EXAMPLE,
  email: 'barnystinson@test.de',
  valid: true,
  scope: [UserGroup.ADMIN],
  linkedPartner: LINKEDPARTNER_EXAMPLE,
};
