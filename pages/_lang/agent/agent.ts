import { Component, Vue } from 'vue-property-decorator';

@Component({
  layout: 'app',
  middleware: 'auth-agent',
})
export default class Agent extends Vue {}
