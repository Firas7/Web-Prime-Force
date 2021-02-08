import { Component, Vue } from 'vue-property-decorator';
import { validationService } from '~/services/validation.service';
import { UserModel } from '~/models/user.model';
import { authService } from '~/services/auth.service';
import { Status } from '~/models/status.enum';
import { UserGroup } from '~/models/user-group.enum';
import { AuthModel } from '~/models/auth.enum';
import { Branch } from '~/models/branch-form/branch.enum';

@Component({
  layout: 'app',
})
export default class CreateUser extends Vue {
  user: Partial<UserModel> = {};
  auth: AuthModel = { branch: '', level: -1 };
  branch: Branch[] = [];

  created() {
    this.user.scope = [UserGroup.CLERK];
    this.setBranchSelectOptions();
  }

  validateEmail(value: any): boolean | string {
    return validationService.validateEmail(value);
  }

  validateScope(value: any) {
    return validationService.validateScope(value);
  }

  backToAdmin() {
    this.$router.push('/admin');
  }

  setBranchSelectOptions() {
    Object.values(Branch).forEach((value) => {
      this.branch.push(value);
    });
  }

  createUser() {
    let user = this.user;
    if (this.auth.branch != '' && this.auth.level > 0) {
      user.auth = this.auth;
    }
    authService.registerByAdmin(user).then((response) => {
      if (response == Status.SUCCESS) {
        alert('Successfully');
        this.$router.push('/admin');
      }
    });
  }
}
