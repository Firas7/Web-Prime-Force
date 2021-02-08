import { Component, Vue } from 'vue-property-decorator';
import Message from '~/components/messages/index.vue';
import Chat from '~/components/chat/index.vue';

@Component({
  middleware: 'auth-admin',
  layout: 'app',

  components: {
    messages: Message,
    chat: Chat,
  },
})
export default class extends Vue {}
