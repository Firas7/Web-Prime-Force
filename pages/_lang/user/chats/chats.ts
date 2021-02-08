import { Component, Vue } from 'vue-property-decorator';
import chatOverview from '~/components/chat-overview/index.vue';

@Component({
  layout: 'app',
  middleware: 'auth-insured',

  components: {
    chatOverview: chatOverview,
  },
})
export default class Chats extends Vue {}
