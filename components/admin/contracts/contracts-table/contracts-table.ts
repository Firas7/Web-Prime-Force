import { Component, Emit, Prop, PropSync, Vue } from 'vue-property-decorator';
import { ContractModel } from '~/models/contract.model';
import FormDialog from '../form-dialog/index.vue';
import moment from 'moment';

@Component({
  components: {
    formDialog: FormDialog,
  },
})
export default class ContractsTable extends Vue {
  @Prop()
  readonly contracts: ContractModel[] | undefined;

  @Prop({ required: true })
  readonly loading: boolean | undefined;

  @Prop({ required: true })
  readonly detailPath: string | undefined;

  @Prop({ required: true })
  readonly scopeAdmin: boolean | undefined;

  @Prop()
  readonly documents: number | undefined;

  @Prop()
  readonly itemsPerPage: number[] | undefined;

  @PropSync('change', { type: Number })
  limit!: number;

  contract: ContractModel = {
    insurancepapernumber: '',
    partnerId: '',
    productname: '',
  } as ContractModel;

  //Hier nichts ändern
  editMode: boolean = false;
  showDialog: boolean = false;
  startIndex: number = 0;
  endIndex: number = 0;

  created() {
    if (!!this.documents && !!this.contracts) {
      this.endIndex = this.limit;
    }
  }

  @Emit('addContract')
  addContract(contract: ContractModel) {
    this.startIndex = 0;
    this.endIndex = this.limit;
    return contract;
  }

  @Emit('deleteContract')
  deleteContract(contractId: string) {
    this.startIndex = 0;
    this.endIndex = this.limit;
    return contractId;
  }

  @Emit('addClaimcase')
  addClaimcase(partnerId: string, contractId: string, branch: string) {
    return { partnerId: partnerId, contractId: contractId, branch: branch };
  }

  showDetail(contract: ContractModel) {
    this.$router.push(this.detailPath + '/' + contract._id);
  }

  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
  }

  showFormDialog() {
    this.showDialog = true;
    this.editMode = false;
  }

  @Emit('fetchContracts')
  changeLimit(limit: number) {
    this.startIndex = 0;
    this.endIndex = limit;
    return { startIndex: this.startIndex, limit: limit };
  }

  @Emit('fetchContracts')
  nextPage() {
    if (
      !!this.documents &&
      this.startIndex <= this.documents &&
      this.startIndex + this.limit < this.documents
    ) {
      this.startIndex += this.limit;
      this.endIndex = this.startIndex + this.limit;

      if (this.startIndex + this.limit > this.documents) {
        this.endIndex = this.documents;
      }
    }
    return { startIndex: this.startIndex, limit: this.limit };
  }

  @Emit('fetchContracts')
  previousPage() {
    if (this.startIndex !== 0) {
      this.startIndex -= this.limit;
      this.endIndex === this.documents
        ? (this.endIndex = this.startIndex + this.limit)
        : (this.endIndex -= this.limit);
    }
    return { startIndex: this.startIndex, limit: this.limit };
  }
}
