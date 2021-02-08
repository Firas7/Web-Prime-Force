export interface ClerkModel {
  _id: string;
  name: string;
  insurence: string;
  email: string;
  phoneNumber: string;
  faceImage: string;
}

export const CLERK_MODEL_MALE_EXAMPLE: ClerkModel = {
  _id: '4bab9ba2-5c26-4b3f-8f5e-d20ca7cd38c9',
  name: 'Hans Peter',
  insurence: 'VGH Versicherungen',
  email: 'hans.peter@vgh-test.de',
  phoneNumber: '+49511332211',
  faceImage:
    'https://images.unsplash.com/photo-1553267751-1c148a7280a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=100&h=100&q=80',
};

export const CLERK_MODEL_FEMALE_EXAMPLE: ClerkModel = {
  _id: '20ede578-8d2d-483c-9a57-675194401335',
  name: 'Lisa Müller',
  insurence: 'VGH Versicherungen',
  email: 'lisa.mueller@vgh-test.de',
  phoneNumber: '+49511332212',
  faceImage:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=100&h=100&q=60',
};
