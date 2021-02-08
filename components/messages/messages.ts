import { Component, Vue } from 'vue-property-decorator';
import { MessageModel, ChatModel } from '~/models/chat.model';
import { UserModel } from '~/models/user.model';
import moment from 'moment';

@Component
export default class Messages extends Vue {
  showReply: boolean = false;
  answer: boolean = false;

  get chat(): ChatModel {
    return this.$store.state.chat.chats;
  }

  get user(): UserModel {
    return this.$accessor.user.user;
  }

  get messages(): MessageModel[] {
    return this.$accessor.chat.getMessages;
  }

  get replyPressed() {
    return this.answer;
  }

  reply() {
    if (this.answer === false) {
      this.answer = true;
    } else {
      this.answer = false;
    }
  }

  get showAnswer() {
    return this.showReply;
  }

  showAnswers() {
    if (this.showReply === false) {
      this.showReply = true;
    } else {
      this.showReply = false;
    }
  }
  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY,hh:mm');
  }
}
