import { Component, Emit, Prop, PropSync, Vue } from 'vue-property-decorator';
import { ContractModel } from '~/models/contract.model';
import { ValidationErrors } from '~/models/validationErrors.enum';
import { validationService } from '~/services/validation.service';
import { Branch } from '~/models/branch-form/branch.enum';
import moment from 'moment';

@Component
export default class FormDialog extends Vue {
  @PropSync('show', { type: Boolean })
  syncedShow!: boolean;

  @PropSync('date', { type: String, default: '' })
  startdate!: string;

  @Prop()
  readonly contract: ContractModel | undefined;

  @Prop()
  readonly editMode: boolean | undefined;

  contractModel: Partial<ContractModel> = { ...this.contract };

  datePickerMenu: boolean = false;
  valid: boolean = true;
  branch: string[] = [];

  @Emit('addContract')
  save() {
    this.syncedShow = false;
    let contract = this.contractModel;
    this.contractModel.startdate = moment(this.choosenModel().startdate);
    this.contractModel = {} as ContractModel;
    return contract;
  }

  @Emit('editContract')
  edit() {
    this.syncedShow = false;
    return this.contract;
  }

  @Emit('close')
  closeDetailDialog() {
    this.contractModel = {} as ContractModel;
    this.syncedShow = false;
  }

  created() {
    this.setBranchSelectOptions();
  }

  setBranchSelectOptions() {
    Object.values(Branch).forEach((value) => {
      this.branch.push(value);
    });
  }

  choosenModel(): Partial<ContractModel> {
    return !!this.contract && !!this.contract._id
      ? this.contract
      : this.contractModel;
  }

  validateTextField(text: string): boolean | string | ValidationErrors {
    let result = validationService.validateTextField(text);
    return result === ValidationErrors.VALID
      ? true
      : ValidationErrors.TEXTFIELD_EMPTY;
  }

  validateDate(date: string): boolean | string | ValidationErrors {
    let validation = validationService.validateDate(date, 'YYYY-MM-DD');
    return validation === ValidationErrors.VALID
      ? true
      : ValidationErrors.TEXTFIELD_EMPTY;
  }
}
