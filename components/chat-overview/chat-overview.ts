import { Component, Vue } from 'vue-property-decorator';
import Message from '~/components/messages/index.vue';
import Chat from '~/components/chat/index.vue';
import { ChatModel } from '~/models/chat.model';
import { UserModel } from '~/models/user.model';
import { UserGroup } from '~/models/user-group.enum';
import moment from 'moment';

@Component({
  layout: 'app',
  middleware: 'auth-insured',
  components: {
    messages: Message,
    chat: Chat,
  },
})
export default class chatOverview extends Vue {
  get chats(): ChatModel[] {
    return this.$accessor.chat.chats;
  }

  get partNames(): string[] {
    return this.$accessor.chat.participantNames;
  }

  get user(): UserModel {
    return this.$accessor.user.user;
  }

  get scopeInsured(): boolean {
    return this.$accessor.accessToken.getScope.includes(UserGroup.INSURED);
  }

  chatPath: string = '/user/chats';
  loading: boolean = false;

  created() {
    this.loading = true;

    this.$accessor.user
      .fetchUser(this.$accessor.accessToken.userId)
      .then(() => {
        this.$accessor.chat.fetchChatsByUserId(
          this.$accessor.accessToken.userId
        );
      });
    this.delay(200)
      .then(() => {
        this.chats.forEach((chat: ChatModel) => {
          this.getParticipantName(
            chat.participants_id,
            this.$accessor.accessToken.userId
          );
        });
      })
      .then(() => {
        this.loading = false;
      });
  }

  getParticipantName(participants: string[], userId: string): void {
    participants.forEach((participantsID) => {
      if (participantsID != userId) {
        this.$accessor.chat.fetchUserNameByUserId(participantsID);
      }
    });
  }

  openChat(chatID: string): void {
    this.$router.push(this.chatPath + '/' + chatID);
  }
  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
  }

  async delay(ms: number) {
    await new Promise((resolve) => setTimeout(() => resolve(), ms)).then(() =>
      console.log('timeouted')
    );
  }
}
