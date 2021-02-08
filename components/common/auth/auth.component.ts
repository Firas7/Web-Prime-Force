import { Component, Vue } from 'vue-property-decorator';
import { Prop } from '~/node_modules/vue-property-decorator';
import { AuthModel } from '../../../models/auth.enum';

@Component
export default class AuthComponent extends Vue {
  @Prop() readonly auth: AuthModel | undefined;

  get isInsured() {
    return this.$accessor.accessToken.isInsured;
  }
}
