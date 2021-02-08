import { Component, Vue } from 'vue-property-decorator';
import chatOverview from '~/components/admin/chat-overview/index.vue';
@Component({
  layout: 'app',
  middleware: 'auth-admin',

  components: {
    chatOverview: chatOverview,
  },
})
export default class Chats extends Vue {}
