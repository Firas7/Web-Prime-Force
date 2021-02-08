export interface AgentModel {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  faceImage: string;
}

export const AGENTMODEL_EXAMPLE: AgentModel = {
  _id: '4bab9ba2-5c26-4b3f-8f5e-d20ca7cd38c9',
  name: 'Hans Peter',
  email: 'hans.peter@vgh-test.de',
  phoneNumber: '+49511332211',
  faceImage:
    'https://images.unsplash.com/photo-1553267751-1c148a7280a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=100&h=100&q=80',
};
