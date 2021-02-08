import { Component, Vue } from 'vue-property-decorator';
import { Status } from '~/models/status.enum';
import { Prop } from '~/node_modules/vue-property-decorator';

@Component
export default class Statuscomponent extends Vue {
  @Prop() readonly status: Status | undefined;

  Status = Status;
}
