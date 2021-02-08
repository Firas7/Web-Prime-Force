import { Moment } from '~/node_modules/moment';

export interface ChatModel {
  _id: string;

  participants_id: string[];

  timestamp: Moment;

  businessObectID?: string;

  category?: string;

  active: boolean;

  messages: MessageModel[];
}

export interface MessageModel {
  message_id: string;

  author_id: string;

  timestamp: Moment;

  content: string;
}
