import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { ChatModel } from '~/models/chat.model';
import { MessageModel } from '~/models/chat.model';
import { chatService } from '~/services/chat.service';
import { userService } from '~/services/user.service';

export const state = () => ({
  chats: [] as ChatModel[],
  chat: {} as ChatModel,
  messages: [] as MessageModel[],
  participantNames: [] as string[],
  documents: {} as number,
});

export const getters = getterTree(state, {
  chats: (state) => {
    return state.chats;
  },
  getChatId: (state) => {
    return state.chat._id;
  },
  getMessages: (state) => {
    return state.messages;
  },
  getDocuments: (state) => {
    return state.documents;
  },
  getParticipantNames: (state) => {
    return state.participantNames;
  },
});

export const mutations = mutationTree(state, {
  setChats(state, payload: ChatModel[]) {
    state.chats = payload;
  },
  setChat(state, payload: ChatModel) {
    state.chats[0] = payload;
  },
  setDocuments(state, payload: number) {
    state.documents = payload;
  },
  setParticipantNames(state, payload: string[]) {
    state.participantNames = payload;
  },
  addParticipantName(state, payload: string) {
    state.participantNames.push(payload);
  },
  setMessages(state, payload: MessageModel[]) {
    state.messages = payload;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialise({ commit }) {
      commit('setChats', []);
    },
    async fetchChatsByUserId({ commit }, userId: string) {
      await chatService.getChatsByUserId(userId).then((chats: ChatModel[]) => {
        commit('setChats', chats);
      });
    },
    async fetchChatByChatId({ commit }, chatId: string) {
      await chatService.getChatByChatId(chatId).then((chat: ChatModel[]) => {
        commit('setChat', chat[0]);
        commit('setMessages', chat[0].messages);
      });
    },
    async fetchUserNameByUserId({ commit }, userId: string) {
      await userService.getUserName(userId).then((participantName: string) => {
        commit('addParticipantName', participantName);
      });
    },
    /*sync fetchClerkImageByUserId({ commit }, userId: string) {
      await clerkService.getFaceImage(userId).then((faceImage: string) => {
        commit('addParticipantName', participantName);
      });
    },*/
  }
);

export type RootState = ReturnType<typeof state>;
