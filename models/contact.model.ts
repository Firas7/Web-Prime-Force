export interface ContactModel {
  postOfficeBox?: string;
  mail?: string;
  telefon?: string;
  cellphonenumber?: string;
}

export const CONTACT_EXAMPLE: ContactModel = {
  postOfficeBox: 'Keine Ahnung was gemeint ist',
  mail: 'test@test.de',
  telefon: '660-101-3467',
  cellphonenumber: '0176 555 555',
};

export const CONTACT_HOLDER: ContactModel = {
  postOfficeBox: '',
  mail: '',
  telefon: '',
  cellphonenumber: '',
};
