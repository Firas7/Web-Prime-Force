export interface AddressModel {
  streetaddress?: string;
  housenumber: number;
  postcode?: string;
  city?: string;
  country?: string;
  state?: string;
}

export const ADDRESS_EXAMPLE: AddressModel = {
  streetaddress: 'Hills Manor',
  housenumber: 10,
  postcode: '37666-1653',
  city: 'Köln',
  country: 'Germnay',
  state: 'West Virginia',
};

export const ADDRESS_HOLDER: AddressModel = {
  streetaddress: '',
  housenumber: 0,
  postcode: '',
  city: '',
  country: '',
  state: '',
};
