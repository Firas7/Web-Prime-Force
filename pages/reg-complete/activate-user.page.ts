import { Component, Vue } from 'vue-property-decorator';
import { WithRoute } from '~/router/withRoute';
import { authService } from '~/services/auth.service';
import { Status } from '~/models/status.enum';

@Component({})
export default class ActivateUser extends Vue implements WithRoute {
  constructor() {
    super();

    if (typeof this.$nuxt.$route.query.token === 'string') {
      const token: string = this.$nuxt.$route.query.token;

      if (token != null) {
        authService.activateUser(token).then((payload) => {
          if (payload.status === Status.SUCCESS && payload.id) {
            this.$accessor.user.fetchUser(payload.id).then(() => {
              this.$router.push(payload.page);
              throw new Error('SUCCESS');
            });
          } else {
            throw new Error('EMAIL_ACTIVATED_FAILED');
          }
        });
      } else {
        throw new Error('EMAIL_ACTIVATED_FAILED');
      }
    } else {
      throw new Error('EMAIL_ACTIVATED_FAILED');
    }
    window.location.href = window.location.origin;
  }
}
