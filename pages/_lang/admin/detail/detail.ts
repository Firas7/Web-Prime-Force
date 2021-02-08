import { Component, Vue } from 'vue-property-decorator';

@Component({
  layout: 'app',
  middleware: 'auth-admin-agent-clerk',
})
export default class Detail extends Vue {}
