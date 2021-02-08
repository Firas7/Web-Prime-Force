import { Component, Emit, PropSync, Vue } from 'vue-property-decorator';
import { Status } from '~/models/status.enum';
import { ValidationErrors } from '~/models/validationErrors.enum';
import { WithRoute } from '~/router/withRoute';
import { authService } from '~/services/auth.service';
import { validationService } from '~/services/validation.service';
import { UserGroup } from '~/models/user-group.enum';

@Component
export default class Login extends Vue implements WithRoute {
  hiddenPassword = true;

  email: string = '';

  password: string = '';

  valid = true;

  @PropSync('show', { type: Boolean }) syncedShow!: boolean;

  @Emit('switch')
  switchToRegister() {
    return true;
  }

  showPassword() {
    this.hiddenPassword = !this.hiddenPassword;
  }

  handleKeyEvent() {
    return this.valid ? this.login() : null;
  }

  validateEmail(value: any): boolean | string | ValidationErrors {
    return validationService.validateEmail(value);
  }

  login() {
    authService
      .login({ email: this.email, password: this.password })
      .then((payload) => {
        if (payload.status === Status.SUCCESS && !!payload.id) {
          this.$accessor.accessToken.addAccessToken(payload.id).then(() => {
            if (!!payload.id && !!payload.scope) {
              this.$accessor.accessToken.addUserId(payload.id);
              this.$accessor.accessToken.addScope(payload.scope);
              if (payload.scope == null) {
                throw new Error('USER HAS NO GROUP');
              }
              this.$accessor.user.fetchUser(payload.id).then(() => {
                if (payload.scope!.includes(UserGroup.INSURED)) {
                  this.$router.push('user');
                } else {
                  this.$router.push('admin');
                }

                this.syncedShow = false;
                throw new Error('SUCCESS');
              });
            }
          });
        }
      });
  }
}
