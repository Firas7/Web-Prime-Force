import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ClaimcaseModel } from '~/models/claimcase.model';
import StatusComponent from '~/components/common/status.component/index.vue';
import { Status } from '~/models/status.enum';
import { ContractModel } from '~/models/contract.model';

@Component({
  components: {
    statuscomponent: StatusComponent,
  },
})
export default class ClaimcaseView extends Vue {
  @Prop() claimcases: ClaimcaseModel[] | undefined;
  @Prop() contracts: ContractModel[] | undefined;

  Status = Status;
  detailPath: string = '/claim/';
  getContract(contractId: string) {
    if (!!this.claimcases && this.claimcases.length !== 0) {
      if (!!this.contracts && this.contracts.length !== 0) {
        return this.contracts.find((contract) => contract._id === contractId);
      }
    }
  }

  showDetail(casedetail: ClaimcaseModel) {
    this.$router.push({ path: this.detailPath + casedetail._id });
  }
  constructor() {
    super();
  }
}
