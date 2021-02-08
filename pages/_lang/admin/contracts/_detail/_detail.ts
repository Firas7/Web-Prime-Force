import { Component, Vue } from 'vue-property-decorator';
import ContractsTable from '~/components/admin/contracts/contracts-table/index.vue';
import Formdialog from '~/components/admin/contracts/form-dialog/index.vue';
import DetailDialog from '~/components/admin/contracts/detail-dialog/index.vue';
import { ContractModel } from '~/models/contract.model';
import { UserGroup } from '~/models/user-group.enum';
import { InsuredModel } from '~/models/insured.model';
import AuthComponent from '~/components/common/auth/index.vue';

@Component({
  layout: 'app',
  middleware: 'auth-admin-agent-clerk',

  components: {
    formDialog: Formdialog,
    contractTable: ContractsTable,
    detailDialog: DetailDialog,
    authComponent: AuthComponent,
  },
})
export default class Detail extends Vue {
  id: string = this.$nuxt.$route.params.detail;
  editMode: boolean = true;

  get contract(): ContractModel {
    return this.$accessor.contract.contracts[0];
  }

  get scopeAdmin(): boolean {
    return this.$accessor.accessToken.getScope.includes(UserGroup.ADMIN);
  }

  get insured(): InsuredModel {
    return this.$accessor.insured.insured;
  }

  created() {
    this.fetchObjects();
  }

  fetchObjects() {
    this.$accessor.contract.fetchContractByContractId(this.id).then(() => {
      this.$accessor.insured.fetchInsuredByPartnerId(this.contract.partnerId);
    });
  }

  editContract(contract: ContractModel) {
    this.$accessor.contract.editContract(contract);
  }
}
