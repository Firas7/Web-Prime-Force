import { Component, Vue } from 'vue-property-decorator';
import { InsuredModel } from '~/models/insured.model';
import { Status } from '~/models/status.enum';
import { insuredService } from '~/services/insured.service';
import moment from '~/node_modules/moment';
import { GenerEnum } from '~/models/gener.enum';
import { AddressModel } from '~/models/address.model';
import { ContactModel } from '~/models/contact.model';
import { validationService } from '~/services/validation.service';

@Component({
  layout: 'app',
})
export default class CreateInsured extends Vue {
  menu: boolean = false;

  //newObj: any;

  address: AddressModel = {} as AddressModel;

  contact: ContactModel = {} as ContactModel;

  insured: InsuredModel = {
    address: this.address,
    contactData: this.contact,
  } as InsuredModel;

  valid: boolean = true;

  /*
  removeEmpty(obj: any): object {
    this.newObj = {};
    Object.keys(obj).forEach((k) => {
      if (!!obj[k] && typeof obj[k] !== 'object') {
        this.newObj[k] = obj[k];
      } else if (!!obj[k] && typeof obj[k] === 'object') {
        let tempObj = this.removeEmpty(obj[k]);
        if (!!tempObj) {
          this.newObj[k] = tempObj;
        }
      }
    });
    return this.newObj;
  }
  */

  gender: string = '';

  birthday: string = '';

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

  translateToGender(gender: String): GenerEnum | undefined {
    if (gender === 'Undefined') {
      return GenerEnum.UNDEFINED;
    } else if (gender === 'Neutral') {
      return GenerEnum.NEUTRAL;
    } else if (gender === 'Female') {
      return GenerEnum.FEMALE;
    } else if (gender === 'Male') {
      return GenerEnum.MALE;
    }
    return undefined;
  }

  addInsured() {
    if (!!this.birthday) {
      this.insured.birthday = moment(moment.utc(this.birthday).format());
    }
    if (!!this.gender) {
      this.insured.gender = this.translateToGender(this.gender);
    }
    /*if (
      !this.address.streetaddress &&
      !this.address.postcode &&
      !this.address.city &&
      !this.address.country &&
      !this.address.state
    ) {
      delete this.insured.address;
    }
    if (
      !this.contact.mail &&
      !this.contact.telefon &&
      !this.contact.cellphonenumber &&
      !this.contact.postOfficeBox
    ) {
      delete this.insured.contactData;
    }*/
    //this.insured = this.removeEmpty(this.insured);
    insuredService.addInsured(this.insured).then((status) => {
      if (status === Status.SUCCESS) {
        alert('Successful');
      } else {
        alert('Failed');
      }
      this.$router.push('/admin/insured');
    });
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
