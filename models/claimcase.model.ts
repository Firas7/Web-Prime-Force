import { Status } from '~/models/status.enum';
import { Moment } from '~/node_modules/moment';
import { RatingModel } from './rating.model';

export interface ClaimcaseModel {
  _id: string;
  branch: string;
  date?: Moment;
  status: Status;
  secret: string;
  partnerId: string;
  contractId: string;
  rating?: RatingModel;
}

export interface ClaimcaseCountStateModel {
  SUCCESS: number;
  UNKNOWN_USER: number;
  UNKNOWN_ERROR: number;
  NONE: number;
  PENDING: number;
  PROGRESS: number;
  FINISHED: number;
  DECLINED: number;
}
export const ClaimcaseCountStateModel_Default: ClaimcaseCountStateModel = {
  SUCCESS: 0,
  UNKNOWN_USER: 0,
  UNKNOWN_ERROR: 0,
  NONE: 0,
  PENDING: 0,
  PROGRESS: 0,
  FINISHED: 0,
  DECLINED: 0,
};
