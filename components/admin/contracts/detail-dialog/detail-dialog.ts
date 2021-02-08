import { Component, Emit, Prop, Vue, PropSync } from 'vue-property-decorator';
import { ContractModel } from '~/models/contract.model';
import FormDialog from '~/components/admin/contracts/form-dialog/index.vue';
import { InsuredModel } from '~/models/insured.model';
import moment from 'moment';

@Component({
  components: {
    formDialog: FormDialog,
  },
})
export default class DetailDialog extends Vue {
  claimcasePath: string = '/user/claim/claimcase';

  @PropSync('change', { type: Object })
  contract!: ContractModel;

  @Prop()
  readonly insured: InsuredModel | undefined;

  @Prop()
  readonly editMode: boolean | undefined;

  @Prop()
  readonly scopeAdmin: boolean | undefined;

  startdate: string = '';
  showEditDialog: boolean = false;

  @Emit('editContract')
  editContract(contract: ContractModel) {
    contract.startdate = moment(this.startdate);
    return contract;
  }

  edit() {
    this.startdate = moment(this.contract.startdate)
      .toISOString()
      .substring(0, 10);
    this.showEditDialog = true;
  }

  switchBack() {
    this.$router.go(-1);
  }

  @Emit('fetchObjects')
  close() {
    this.showEditDialog = false;
  }

  addClaimcase() {
    this.showEditDialog = false;
    this.$accessor.branchForm.initialise();
    this.$accessor.branchForm.setContractId(this.contract._id);
    this.$accessor.branchForm.setPartnerId(this.contract.partnerId);
    this.$accessor.branchForm.setBranch(this.contract.branch);
    this.$router.push(this.claimcasePath);
  }

  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
  }
}
