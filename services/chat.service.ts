import axios from 'axios';
import { MessageModel, ChatModel } from '~/models/chat.model';
import { Status } from '~/models/status.enum';

class ChatService {
  private readonly API_URL: string = '/api/chat';

  public async saveMessage(
    message: MessageModel,
    id: string
  ): Promise<{ status: Status }> {
    const res = await axios.put(this.API_URL + '/' + id + '/message', message);
    let status: Status =
      res.status == 201 ? Status.SUCCESS : Status.UNKNOWN_ERROR;
    return { status };
  }

  public async getChatsByUserId(userId: string): Promise<ChatModel[]> {
    return await axios
      .get<ChatModel[]>(this.API_URL + '/uid/' + userId)
      .then((response) => {
        const data = response.data;
        return data;
      });
  }

  public async getChatByChatId(chatId: string): Promise<ChatModel[]> {
    return await axios
      .get<ChatModel[]>(this.API_URL + '/' + chatId)
      .then((response) => {
        const data = response.data;
        return data;
      });
  }
}

export const chatService = new ChatService();
