import { Component, Emit, PropSync, Vue } from 'vue-property-decorator';
import { UserModel } from '~/models/user.model';
import { authService } from '~/services/auth.service';
import { validationService } from '~/services/validation.service';
import { WithRoute } from '~/router/withRoute';

@Component
export default class Register extends Vue implements WithRoute {
  hiddenPassword = true;

  user: Partial<UserModel> = {};

  password: string = '';

  passwordMatch: string = '';

  valid = true;

  sendEmail = false;

  @PropSync('show', { type: Boolean }) syncedShow!: boolean;

  @Emit('switch')
  switchToRegister() {
    return true;
  }

  showPassword() {
    this.hiddenPassword = !this.hiddenPassword;
  }

  validateEmail(value: any): boolean | string {
    return validationService.validateEmail(value);
  }

  validatePasswordLength(value: string): boolean | string {
    return validationService.validatePasswordLength(value);
  }

  validatePasswordMatch(v: string): boolean | string {
    return validationService.validatePasswordMatch(this.password, v);
  }

  register() {
    const user = this.user;
    authService.register(user, this.password).then((response) => {
      if (response == true) {
        this.sendEmail = true;
      }
    });
  }

  closeRegister() {
    this.$router.push('user');
  }
}
