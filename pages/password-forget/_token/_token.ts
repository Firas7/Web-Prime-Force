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
export default class Token extends Vue {
  token: string = this.$nuxt.$route.params.token;

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

  reset() {
    authService
      .reset({ password: this.password, resetPasswordToken: this.token })
      .then((status) => {
        if (status === Status.SUCCESS) {
          this.confirmPassword = true;
        }
      });
  }

  closeReset() {
    this.$router.push('/');
  }
}
