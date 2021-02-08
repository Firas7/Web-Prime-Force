import { Component, Vue } from 'vue-property-decorator';
import ContractTable from '~/components/admin/contracts/contracts-table/index.vue';
import FormDialog from '~/components/admin/contracts/form-dialog/index.vue';
import DetailDialog from '~/components/admin/contracts/detail-dialog/index.vue';
import { ContractModel } from '~/models/contract.model';
import { UserModel } from '~/models/user.model';
import { UserGroup } from '~/models/user-group.enum';

@Component({
  layout: 'app',
  middleware: 'auth-insured',

  components: {
    formDialog: FormDialog,
    contractTable: ContractTable,
    detailDialog: DetailDialog,
  },
})
export default class Contracts extends Vue {
  get contracts(): ContractModel[] {
    return this.$accessor.contract.contracts;
  }

  get user(): UserModel {
    return this.$accessor.user.user;
  }

  get scopeAdmin(): boolean {
    return this.$accessor.accessToken.getScope.includes(UserGroup.ADMIN);
  }

  claimcasePath: string = '/user/claim/claimcase';
  detailPath: string = '/user/contracts';
  loading: boolean = false;

  created() {
    this.loading = true;
    this.$accessor.user
      .fetchUser(this.$accessor.accessToken.userId)
      .then(() => {
        if (
          !!this.user &&
          this.user.linkedPartner &&
          this.user.linkedPartner.partnerId
        ) {
          this.$accessor.contract.fetchUserContractsByPartnerId(
            this.user.linkedPartner.partnerId
          );
        }
      })
      .then(() => {
        this.loading = false;
      });
  }

  addClaimcase(params: { contractId: string; branch: string }) {
    this.$accessor.branchForm.initialise();
    this.$accessor.branchForm.setContractId(params.contractId);
    this.$accessor.branchForm.setBranch(params.branch);
    this.$router.push(this.claimcasePath);
  }
}
