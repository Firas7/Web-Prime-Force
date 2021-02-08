import { Component, Vue } from 'vue-property-decorator';
import AppHeader from '~/components/app-header/index.vue';
import { Status } from '~/models/status.enum';
import { ValidationErrors } from '~/models/validationErrors.enum';
import { authService } from '~/services/auth.service';
import { validationService } from '~/services/validation.service';

@Component({
  components: {
    appHeader: AppHeader,
  },
})
export default class PasswordForget extends Vue {
  email: string = '';

  valid = true;

  sendEmail = false;

  validateEmail(value: any): boolean | string | ValidationErrors {
    return validationService.validateEmail(value);
  }

  recover() {
    authService.recover({ email: this.email }).then((status) => {
      if (status === Status.SUCCESS) {
        this.sendEmail = true;
      }
    });
  }

  closeRecover() {
    this.$router.push('/');
  }
}
