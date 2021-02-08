import axios from '~/node_modules/axios';
import { Status } from '~/models/status.enum';
import { UserGroup } from '~/models/user-group.enum';
import { UserModel } from '~/models/user.model';

var jwt = require('jsonwebtoken');

class AuthService {
  private readonly API_URL: string = '/api/users';

  public async register(
    user: Partial<UserModel>,
    password: string
  ): Promise<boolean> {
    let payload = user as any;
    payload['password'] = password;
    const httpResponse = await axios.post<String>(
      this.API_URL + '/register',
      payload
    );
    /*if (httpResponse.status != 200) {
          //TODO in lib console.log("ERROR AUTH " + httpResponse.data);
        }*/
    localStorage.setItem('access_token', httpResponse.data as string);
    return true;
  }

  public async registerByAdmin(user: Partial<UserModel>): Promise<String> {
    const httpResponse = await axios.post(this.API_URL + '/regByAdmin', user);

    if (httpResponse.status === 201) {
      return Status.SUCCESS;
    } else {
      return Status.UNKNOWN_ERROR;
    }
  }

  public async login(user: {
    email: string;
    password: string;
  }): Promise<{
    status: Status;
    page: string;
    id?: string;
    scope?: UserGroup[];
  }> {
    return await axios
      .post(this.API_URL + '/authenticate', user)
      .then((response) => {
        if (response.status === 201) {
          localStorage.setItem('access_token', response.data.id_token);
          const scope = this.getScope(response.data.id_token);
          switch (true) {
            case scope.includes(UserGroup.ADMIN):
              return {
                status: Status.SUCCESS,
                page: 'admin',
                id: this.getId(response.data.id_token),
                scope: scope,
              };
            case scope.includes(UserGroup.INSURED):
              return {
                status: Status.SUCCESS,
                page: 'user',
                id: this.getId(response.data.id_token),
                scope: scope,
              };
            case scope.includes(UserGroup.CLERK):
              return {
                status: Status.SUCCESS,
                page: 'clerk',
                id: this.getId(response.data.id_token),
                scope: scope,
              };
            case scope.includes(UserGroup.AGENT):
              return {
                status: Status.SUCCESS,
                page: 'agent',
                id: this.getId(response.data.id_token),
                scope: scope,
              };
            default:
              return { status: Status.UNKNOWN_ERROR, page: '/' };
          }
        } else {
          return { status: Status.UNKNOWN_ERROR, page: '/' };
        }
      });
  }

  public async recover(user: { email: string }): Promise<Status> {
    const httpResponse = await axios.post<String>(
      this.API_URL + '/recover',
      user
    );

    if (httpResponse.status === 200) {
      return Status.SUCCESS;
    } else {
      return Status.UNKNOWN_ERROR;
    }
  }

  public async activateUser(
    pathToken: string
  ): Promise<{ status: Status; page: string; id?: string }> {
    const res = await axios.put<String>(
      this.API_URL + '/authenticate/validMail?token=' + pathToken
    );
    if (res.status === 201) {
      localStorage.setItem('access_token', res.data as string);
      const scope = this.getScope(res.data as string);
      if (scope.includes(UserGroup.ADMIN)) {
        return {
          status: Status.SUCCESS,
          page: 'admin',
          id: this.getId(res.data as string),
        };
      }
      if (scope.includes(UserGroup.INSURED)) {
        return {
          status: Status.SUCCESS,
          page: 'user',
          id: this.getId(res.data as string),
        };
      } else {
        return { status: Status.UNKNOWN_ERROR, page: '/' };
      }
    } else {
      return { status: Status.UNKNOWN_ERROR, page: '/' };
    }
  }

  public async reset(user: {
    password: string;
    resetPasswordToken: string;
  }): Promise<Status> {
    const httpResponse = await axios.post<String>(
      this.API_URL + '/reset',
      user
    );

    if (httpResponse.status === 200) {
      return Status.SUCCESS;
    } else {
      return Status.UNKNOWN_ERROR;
    }
  }

  public getScope(token: string): UserGroup[] {
    const decodedToken: any = jwt.decode(token);
    return decodedToken.scope;
  }
  public getId(token: string): string {
    const decodedToken: any = jwt.decode(token);
    return decodedToken.id;
  }

  public async changeInitialPassword(data: {
    registerToken: string | (string | null)[];
    token: string;
    newPassword: string;
  }): Promise<{
    status: Status;
    page: string;
    id?: string;
    scope?: UserGroup[];
  }> {
    return await axios
      .post(this.API_URL + '/register/setPassword', data)
      .then((response) => {
        if (response.status === 201) {
          localStorage.setItem('access_token', response.data.id_token);
          const scope = this.getScope(response.data.id_token);
          switch (true) {
            case scope.includes(UserGroup.ADMIN):
              return {
                status: Status.SUCCESS,
                page: 'admin',
                id: this.getId(response.data.id_token),
                scope: scope,
              };
            case scope.includes(UserGroup.INSURED):
              return {
                status: Status.SUCCESS,
                page: 'user',
                id: this.getId(response.data.id_token),
                scope: scope,
              };
            case scope.includes(UserGroup.CLERK):
              return {
                status: Status.SUCCESS,
                page: 'clerk',
                id: this.getId(response.data.id_token),
                scope: scope,
              };
            case scope.includes(UserGroup.AGENT):
              return {
                status: Status.SUCCESS,
                page: 'agent',
                id: this.getId(response.data.id_token),
                scope: scope,
              };
            default:
              return { status: Status.UNKNOWN_ERROR, page: '/' };
          }
        } else {
          return { status: Status.UNKNOWN_ERROR, page: '/' };
        }
      });
  }
}

// Export a singleton instance in the global namespace
export const authService = new AuthService();
