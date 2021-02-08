import axios from 'axios';
import { ClaimcaseModel } from '~/models/claimcase.model';
import { Status } from '~/models/status.enum';
import { deserializeDates } from './serialization';
import { Moment, utc } from 'moment';
import { ClaimcaseCountStateModel } from '../models/claimcase.model';
import { RatingModel } from '~/models/rating.model';

class ClaimcaseService {
  private readonly API_URL_CLAIM_CASE: string = '/api/claim/cases';
  private readonly API_URL_CLAIM_CASE_SINGULAR: string = '/api/claim/case';

  public async getAllClaimcases(): Promise<ClaimcaseModel[]> {
    return await axios
      .get<ClaimcaseModel[]>(this.API_URL_CLAIM_CASE)
      .then((response) => {
        const data = response.data;
        data.map((claim: ClaimcaseModel) => {
          return {
            ...claim,
            date: deserializeDates<ClaimcaseModel, Moment>(
              [claim],
              ['date'],
              utc
            )[0],
            //driverBirth: deserializeDates<ClaimcaseModel, Moment>([claim], ['driverBirth'], utc)[0],
          };
        });
        return data;
      });
  }

  public async getAllClaimcasesLimited(
    maxResults: number
  ): Promise<ClaimcaseModel[]> {
    return await axios
      .get<ClaimcaseModel[]>(
        this.API_URL_CLAIM_CASE + '?maxresults=' + maxResults
      )
      .then((response) => {
        const data = response.data;
        data.map((claim: ClaimcaseModel) => {
          return {
            ...claim,
            date: deserializeDates<ClaimcaseModel, Moment>(
              [claim],
              ['date'],
              utc
            )[0],
            //driverBirth: deserializeDates<ClaimcaseModel, Moment>([claim], ['driverBirth'], utc)[0],
          };
        });
        return data;
      });
  }

  public async getClaimcasesByPartnerId(
    partnerId: string
  ): Promise<ClaimcaseModel[]> {
    return await axios
      .get<ClaimcaseModel[]>(this.API_URL_CLAIM_CASE_SINGULAR + '/' + partnerId)
      .then((response) => {
        const data = response.data;
        data.map((claim: ClaimcaseModel) => {
          return {
            ...claim,
            date: deserializeDates<ClaimcaseModel, Moment>(
              [claim],
              ['date'],
              utc
            )[0],
            //driverBirth: deserializeDates<ClaimcaseModel, Moment>([claim], ['driverBirth'], utc)[0],
          };
        });
        return data;
      });
  }

  public async getCountState(): Promise<ClaimcaseCountStateModel> {
    return await axios
      .get<ClaimcaseCountStateModel>(this.API_URL_CLAIM_CASE + '/count/state')
      .then((response) => {
        const data = response.data;
        return data;
      });
  }
  public async postClaimcase(
    payload: Partial<ClaimcaseModel>
  ): Promise<string> {
    return await axios
      .post(this.API_URL_CLAIM_CASE, payload)
      .then((response) => {
        return response.data;
      });
  }

  public async putClaimcaseImages(
    id: string,
    image: FormData
  ): Promise<Status> {
    return await axios
      .put(
        this.API_URL_CLAIM_CASE_SINGULAR + '/' + 'uploadImage' + '/' + id,
        image,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((response) =>
        response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR
      );
  }

  public async putClaimcaseStatus(id: string, status: Status): Promise<Status> {
    return await axios
      .put('/api/claimcase/changestatus/' + id + '/' + status)
      .then((response) =>
        response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR
      );
  }

  public async getClaimcaseWithSecret(
    id: string,
    secret: string
  ): Promise<ClaimcaseModel> {
    return await axios
      .get<ClaimcaseModel>(this.API_URL_CLAIM_CASE + '/' + id + '/' + secret)
      .then((response) => {
        return response.data;
      });
  }

  public async getClaimcaseImage(id: string, imageID: string): Promise<Object> {
    return await axios
      .get(
        this.API_URL_CLAIM_CASE_SINGULAR +
          '/' +
          'getImage' +
          '/' +
          id +
          '/' +
          imageID,
        {}
      )
      .then((response) => {
        return response.data;
      });
  }
  /*
  public async putClaimcaseWithSecret(
    id: string,
    secret: string,
    payload: ClaimcaseModel
  ): Promise<Status> {
    const updatedPayload = {
      contractID: payload.contractID,
      status: payload.status,
      date: payload.date,
      time: payload.time,
      carID: payload.carID,
      licensePlate: payload.licensePlate,
      mileage: payload.mileage,
      place: payload.place,
      description: payload.description,
      licensePlateOfTrailor: payload.licensePlateOfTrailor,
      driver: {
        driverBirth: payload.driver.driverBirth,
        driverIdentify: payload.driver.driverIdentify,
        other: payload.driver.other,
      },
      questions: {
        validDriven: payload.questions.validDriven,
        driverHasLicense: payload.questions.driverHasLicense,
        hitAndRun: payload.questions.hitAndRun,
        alcoholOrDrugs: payload.questions.alcoholOrDrugs,
        bloodTest: payload.questions.bloodTest,
        drivenAsTeam: payload.questions.drivenAsTeam,
        alcoholLevel: payload.questions.alcoholLevel,
      },
      endMail: payload.sendMail,
    };
    return await axios
      .put(this.API_URL_CLAIM_CASE + id + '/' + secret, updatedPayload)
      .then((response) =>
        response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR
      );
  }
*/
  public async addRating(id: string, rating: RatingModel): Promise<Status> {
    return await axios
      .put(this.API_URL_CLAIM_CASE_SINGULAR + '/rating/' + id, rating)
      .then((response) => {
        return response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
      });
  }

  public async addSchadenssumme(
    _id: string | undefined,
    schadenssumme: number
  ): Promise<Status> {
    return await axios
      .put(this.API_URL_CLAIM_CASE_SINGULAR + '/schadenssumme/' + _id, {
        schadenssumme: schadenssumme,
      })
      .then((response) => {
        return response.status === 200 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
      });
  }
}

export const claimcaseService = new ClaimcaseService();
