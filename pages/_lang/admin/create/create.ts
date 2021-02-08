import { Component, Vue } from 'vue-property-decorator';
import CreateUser from '~/components/admin/create-user/index.vue';

@Component({
  middleware: 'auth-admin-agent-clerk',
  layout: 'app',
  components: {
    createUser: CreateUser,
  },
})
export default class create extends Vue {}
