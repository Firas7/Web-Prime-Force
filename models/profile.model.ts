export interface ProfileModel {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export const PROFILE_EXAMPLE: ProfileModel = {
  _id: '5dd804d569537f0009aaec34',
  firstname: 'Barney',
  lastname: 'Stinson',
  email: 'barney.stinson@test.de',
};
