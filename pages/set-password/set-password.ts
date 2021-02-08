import AppHeader from '~/components/app-header/index.vue';
import { authService } from '~/services/auth.service';
import { Status } from '~/models/status.enum';
import { Component, Vue } from 'vue-property-decorator';
import { validationService } from '~/services/validation.service';

@Component({
  components: {
    appHeader: AppHeader,
  },
})
export default class setPassword extends Vue {
  token: string = '';

  registerToken: string | (string | null)[] = this.$nuxt.$route.query.token;

  password: string = '';

  passwordMatch: string = '';

  hiddenPassword = true;

  valid = true;

  confirmPassword = false;

  showPassword() {
    this.hiddenPassword = !this.hiddenPassword;
  }

  validatePasswordLength(value: string): boolean | string {
    return validationService.validatePasswordLength(value);
  }

  validatePasswordMatch(v: string): boolean | string {
    return validationService.validatePasswordMatch(this.password, v);
  }

  setPassword() {
    authService
      .changeInitialPassword({
        registerToken: this.registerToken,
        token: this.token,
        newPassword: this.password,
      })
      .then((payload) => {
        if (payload.status === Status.SUCCESS && !!payload.id) {
          this.$accessor.accessToken.addAccessToken(payload.id).then(() => {
            if (!!payload.id && !!payload.scope) {
              this.$accessor.accessToken.addUserId(payload.id);
              this.$accessor.accessToken.addScope(payload.scope);
              this.$accessor.user.fetchUser(payload.id).then(() => {
                if (payload.page == 'admin') {
                  this.$router.push(payload.page);
                } else {
                  this.$router.push(payload.page);
                }

                //this.syncedShow = false;
                throw new Error('SUCCESS');
              });
            }
          });
        }
      });
  }
}
