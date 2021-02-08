import { Component, Vue } from 'nuxt-property-decorator';
import InsuredView from '~/components/insured/index.vue';
import ContractView from '~/components/admin/contracts/contract-view/index.vue';
import ClaimcaseView from '~/components/claimcase/claimcase-view/index.vue';
import { InsuredModel } from '~/models/insured.model';
import { ContractModel } from '~/models/contract.model';
import { ClaimcaseModel } from '~/models/claimcase.model';

@Component({
  layout: 'app',
  middleware: 'auth-admin-agent-clerk',
  components: {
    insuredView: InsuredView,
    contractView: ContractView,
    claimcaseView: ClaimcaseView,
  },
})
export default class PartnerID extends Vue {
  id: string = this.$nuxt.$route.params.partnerId;

  tab: string = 'insured';

  detailPath: string = '';

  get insured(): InsuredModel {
    return this.$accessor.insured.insured;
  }

  get contracts(): ContractModel[] {
    return this.$accessor.contract.contracts;
  }

  get claimcases(): ClaimcaseModel[] {
    return this.$accessor.claimcase.getClaimCases;
  }

  created() {
    this.$accessor.insured.fetchInsuredByPartnerId(this.id).then((r) => r);
    this.$accessor.contract.fetchContractsByPartnerId(this.id).then((r) => r);
    this.$accessor.claimcase.fetchClaimCasesByPartnerId(this.id).then((r) => r);

    this.detailPath = '/admin/contracts';
  }

  constructor() {
    super();
    if (!!this.$nuxt.$route.query.activeTab) {
      this.tab = '' + this.$nuxt.$route.query.activeTab;
    } else {
      this.tab = 'insured';
    }
  }
}
