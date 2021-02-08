import { Component, Vue } from 'vue-property-decorator';
import { INSURED_HOLDER, InsuredModel } from '~/models/insured.model';
import { Status } from '~/models/status.enum';
import { insuredService } from '~/services/insured.service';
import moment, { Moment } from '~/node_modules/moment';
import { UserGroup } from '~/models/user-group.enum';
import { GenerEnum } from '~/models/gener.enum';
import { validationService } from '~/services/validation.service';

@Component({
  layout: 'app',
})
export default class InsuredCard extends Vue {
  id: string = this.$nuxt.$route.params.detail;

  menu: boolean = false;

  updateAdmin: boolean = false;

  updateUser: boolean = false;

  edit: boolean = false;

  insured: InsuredModel = INSURED_HOLDER;

  birthday: string = '';

  gender: string = '';

  valid: boolean = true;

  public constructor() {
    super();
    if (
      this.$nuxt.$route.fullPath.includes('admin/insured') &&
      this.$accessor.accessToken.getScope.includes(UserGroup.ADMIN)
    ) {
      this.initializeAdmin(this.id);
      this.updateAdmin = true;
    } else if (
      !!this.$accessor.user.user.linkedPartner &&
      this.$nuxt.$route.fullPath.includes('user') &&
      this.$accessor.accessToken.getScope.includes(UserGroup.INSURED)
    ) {
      this.initializeUser(this.$accessor.user.user.linkedPartner.partnerId);
      this.id = this.insured.partnerId as string;
      this.updateUser = true;
    }
  }

  initializeAdmin(id: string) {
    insuredService.getInsuredByID(id).then((response) => {
      this.insured = response;
      this.birthday = this.birthdayToString(this.insured.birthday);
      this.translateGenderToString();
    });
  }

  initializeUser(id: string) {
    insuredService.getInsuredByUserPartnerID(id).then((response) => {
      this.insured = response;
      this.birthday = this.birthdayToString(this.insured.birthday);
      this.translateGenderToString();
    });
  }

  birthdayToString(birthday: Moment | undefined): string {
    return birthday ? moment(birthday).toISOString().substr(0, 10) : '';
  }

  get computedDate() {
    return this.birthday ? moment(this.birthday).format('L') : '';
  }

  requiredField(text: string): boolean | string {
    if (!!text) {
      return true;
    } else {
      return 'Required';
    }
  }

  validateEmail(email: string) {
    return !!email ? validationService.validateEmail(email) : true;
  }

  switchEdit() {
    this.edit = !this.edit;
  }

  translateToGender() {
    if (this.gender === 'Undefined') {
      this.insured.gender = GenerEnum.UNDEFINED;
    } else if (this.gender === 'Neutral') {
      this.insured.gender = GenerEnum.NEUTRAL;
    } else if (this.gender === 'Female') {
      this.insured.gender = GenerEnum.FEMALE;
    } else if (this.gender === 'Male') {
      this.insured.gender = GenerEnum.MALE;
    }
  }

  translateGenderToString() {
    if (this.insured.gender === 0) {
      this.gender = 'Undefined';
    } else if (this.insured.gender === 1) {
      this.gender = 'Neutral';
    } else if (this.insured.gender === 2) {
      this.gender = 'Female';
    } else if (this.insured.gender === 3) {
      this.gender = 'Male';
    }
  }

  removeEmtpy(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] !== 'object' && !obj[key]) {
        if (typeof obj[key] === 'string') {
          obj[key] = '';
        } else if (typeof obj[key] === 'number') {
          obj[key] = 0 as number;
        }
      } else if (typeof obj[key] !== 'object' && !!obj[key]) {
        Object.keys(obj).forEach((key) => {
          if (typeof obj[key] !== 'object' && !obj[key]) {
            if (typeof obj[key] === 'string') {
              obj[key] = '';
            } else if (typeof obj[key] === 'number') {
              obj[key] = 0 as number;
            }
          }
        });
      }
    });
  }

  updateInsuredAdmin() {
    if (!!this.birthday) {
      this.insured.birthday = moment(moment.utc(this.birthday).format()); //this.insured.birthday = moment(this.birthday);
    } else {
      delete this.insured.birthday;
    }
    this.translateToGender();
    this.removeEmtpy(this.insured);
    insuredService.updateInsured(this.insured, this.id).then((status) => {
      if (status === Status.SUCCESS) {
        alert('Successful');
        this.$router.push('/admin/insured');
      } else {
        alert('Failed');
        this.$router.push('/admin/insured');
      }
    });
  }
  updateInsuredUser() {
    if (!!this.birthday) {
      this.insured.birthday = moment(moment.utc(this.birthday).format()); //this.insured.birthday = moment(this.birthday);
    } else {
      delete this.insured.birthday;
    }
    this.translateToGender();
    this.removeEmtpy(this.insured);
    insuredService.updateInsuredByUser(this.insured).then((status) => {
      if (status === Status.SUCCESS) {
        alert('Successful');
      } else {
        alert('Failed');
      }
    });
    this.edit = false;
  }

  validateForm(): boolean {
    this.valid = true;
    // @ts-ignore
    if (!this.$refs.firstname.validate()) {
      this.valid = false;
    }
    // @ts-ignore
    if (!this.$refs.lastname.validate()) {
      this.valid = false;
    }
    return this.valid;
  }

  backToOverview() {
    this.$router.push('/admin/insured');
  }
}
