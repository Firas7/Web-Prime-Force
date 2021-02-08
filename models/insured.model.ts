import {
  ADDRESS_EXAMPLE,
  ADDRESS_HOLDER,
  AddressModel,
} from '~/models/address.model';
import {
  CONTACT_EXAMPLE,
  CONTACT_HOLDER,
  ContactModel,
} from '~/models/contact.model';
import { GenerEnum } from '~/models/gener.enum';
import moment, { Moment } from '~/node_modules/moment';

export interface InsuredModel {
  _id?: string;
  salutation?: string;
  firstname?: string;
  lastname?: string;
  gender?: GenerEnum;
  birthday?: Moment;
  address?: AddressModel;
  contactData?: ContactModel;
  partnerId?: string;
  mandantenId?: string;
  clerkId?: string;
  agentId?: string;
}

export const INSURED_HOLDER: InsuredModel = {
  _id: '',
  salutation: '',
  firstname: '',
  lastname: '',
  gender: GenerEnum.UNDEFINED,
  birthday: moment('1988-04-26T17:55:11.000Z'),
  address: ADDRESS_HOLDER,
  contactData: CONTACT_HOLDER,
  partnerId: '',
  mandantenId: '',
};

export const INSURED_EXAMPLE: InsuredModel = {
  _id: '5dd804f6c2290f2c3cb87c5c',
  salutation: 'Dr.',
  firstname: 'Liliane',
  lastname: 'Kris',
  gender: GenerEnum.FEMALE,
  birthday: moment('1988-04-26T17:55:11.000Z'),
  address: ADDRESS_EXAMPLE,
  contactData: CONTACT_EXAMPLE,
  partnerId: '5dd804f669537f0009ba2e73',
  mandantenId: '5dd804f669533f0009ba2e73',
};
