import { Component, Vue } from 'vue-property-decorator';
import ContractsTable from '~/components/admin/contracts/contracts-table/index.vue';
import Formdialog from '~/components/admin/contracts/form-dialog/index.vue';
import DetailDialog from '~/components/admin/contracts/detail-dialog/index.vue';
import { ContractModel } from '~/models/contract.model';
import { UserGroup } from '~/models/user-group.enum';
import { UserModel } from '~/models/user.model';
import { InsuredModel } from '~/models/insured.model';

@Component({
  layout: 'app',
  middleware: 'auth-insured',

  components: {
    formDialog: Formdialog,
    contractTable: ContractsTable,
    detailDialog: DetailDialog,
  },
})
export default class Detail extends Vue {
  id: string = this.$nuxt.$route.params.detail;

  get contract(): ContractModel {
    return this.$accessor.contract.contracts[0];
  }

  get scopeAdmin(): boolean {
    return this.$accessor.accessToken.getScope.includes(UserGroup.ADMIN);
  }

  get user(): UserModel {
    return this.$accessor.user.user;
  }

  get insured(): InsuredModel {
    return this.$accessor.insured.insured;
  }

  created() {
    this.$accessor.contract.fetchContractByContractId(this.id).then(() => {
      this.$accessor.insured.fetchInsuredByUserPartnerId(
        this.contract.partnerId
      );
    });
  }
}
