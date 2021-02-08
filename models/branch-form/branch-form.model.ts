import { Status } from '../status.enum';
import { ImageModel } from '../image.model';
import { AuthModel } from '../auth.enum';

export interface BranchFormModel {
  _id?: string;
  branch: string;
  info?: string;
  version: string;
  active: boolean;
  steps: BranchFormStep[];
}

export interface BranchFormStep {
  name: string;
  step: number;
  fields: BranchFormField[];
}

export interface BranchFormField {
  nr?: number;
  id: number;
  type: string;
  enableWhen?: BranchFormFieldCondition;
  value?: any;
  attributes: BranchFormAttributes[];
}

export interface BranchFormAttributes {
  label: string;
  isRequired: boolean;
  length?: number;
  content?: BranchFormAttributesContent[];
  info?: string;
  group?: BranchFormAttributesGroup[];
}

export interface BranchFormFieldCondition {
  id: number;
  value: string;
}

export interface BranchFormAttributesContent {
  text: string;
  value: string;
}

export interface BranchFormAttributesGroup {
  id: number;
  labelRadio: string;
}

export interface BranchFormAnswerModel {
  _id?: string;
  branch: string;
  version: string;
  status: Status;
  partnerId: string | undefined;
  contractId: string | undefined;
  answers: BranchFormAnswer[];
  images?: ImageModel[];
  secret?: string;
  auth?: AuthModel;
}

export interface BranchFormAnswer {
  id: number;
  value: any;
}

export interface BranchFormQuestionAnswer {
  question: string;
  answer: any;
}
