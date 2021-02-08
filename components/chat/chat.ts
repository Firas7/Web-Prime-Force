import { Component, Vue, Prop } from 'vue-property-decorator';
import Messages from '../messages/index.vue';
import { MessageModel } from '~/models/chat.model';
import { chatService } from '~/services/chat.service';
import { validationService } from '~/services/validation.service';
import { ValidationErrors } from '~/models/validationErrors.enum';
import moment from 'moment';

@Component({
  components: {
    messages: Messages,
  },
})
export default class Chat extends Vue {
  @Prop()
  message: MessageModel | undefined;
  loading: boolean = false;
  text: string = '';
  newmessage: MessageModel = {} as MessageModel;

  get messages() {
    return this.$accessor.chat.getMessages;
  }

  saveMessage() {
    let v = this.validateTextField(this.text);
    if (v !== ValidationErrors.TEXTFIELD_EMPTY) {
      var time = moment().format();
      this.newmessage.content = this.text;
      this.newmessage.author_id = this.$accessor.user.user._id;
      this.newmessage.timestamp = moment(moment.utc(time).format());
      this.text = '';
      chatService.saveMessage(this.newmessage, this.$route.params.chats);
      this.$router.go(-1);
    }
    this.$forceUpdate();
  }

  validateTextField(text: string): boolean | string | ValidationErrors {
    let validation = validationService.validateTextField(text);
    return validation === ValidationErrors.VALID
      ? true
      : ValidationErrors.TEXTFIELD_EMPTY;
  }

  getChatId() {
    return this.$accessor.chat.getChatId;
  }

  created() {
    this.loading = true;
    this.$accessor.chat.fetchChatByChatId(this.$route.params.chats).then(() => {
      this.loading = false;
    });
  }
}
