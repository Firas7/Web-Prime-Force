import { Component, Vue } from 'vue-property-decorator';
import ContractsTable from '~/components/admin/contracts/contracts-table/index.vue';
import FormDialog from '~/components/admin/contracts/form-dialog/index.vue';
import DetailDialog from '~/components/admin/contracts/detail-dialog/detail-dialog';
import { ContractModel } from '~/models/contract.model';
import { UserGroup } from '~/models/user-group.enum';

@Component({
  layout: 'app',
  middleware: 'auth-admin-agent-clerk',

  components: {
    formDialog: FormDialog,
    contractsTable: ContractsTable,
    detailDialog: DetailDialog,
  },
})
export default class Contracts extends Vue {
  get contracts(): ContractModel[] {
    return this.$accessor.contract.contracts;
  }

  get scopeAdmin(): boolean {
    return this.$accessor.accessToken.getScope.includes(UserGroup.ADMIN);
  }

  get documents(): number {
    return this.$accessor.contract.documents;
  }

  $i18n: any;
  detailPath: string = '/admin/contracts';
  claimcasePath: string = '/user/claim/claimcase';

  limit: number = 20;
  itemsPerPage = [10, 20, 30, 40, 50];
  loading: boolean = false;

  created() {
    this.fetchContracts({ startIndex: 0, limit: this.limit });
  }

  fetchContracts(pageParams: { startIndex: number; limit: number }) {
    this.loading = true;
    this.$accessor.contract
      .fetchContracts({
        startIndex: pageParams.startIndex,
        limit: this.limit,
      })
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        alert(
          this.$i18n.t(
            'components.admin.contracts.contractsTable.messages.load'
          )
        );
      });
  }

  addContract(contract: ContractModel) {
    this.$accessor.contract.saveContract({
      contract: contract,
      startIndex: 0,
      limit: this.limit,
    });
  }

  deleteContract(contractId: string) {
    if (
      confirm(
        this.$i18n.t(
          'components.admin.contracts.contractsTable.messages.delete'
        )
      )
    ) {
      this.$accessor.contract.deleteContract({
        contractId: contractId,
        startIndex: 0,
        limit: this.limit,
      });
    }
  }

  addClaimcase(params: {
    partnerId: string;
    contractId: string;
    branch: string;
  }) {
    this.$accessor.branchForm.initialise();
    this.$accessor.branchForm.setContractId(params.contractId);
    this.$accessor.branchForm.setPartnerId(params.partnerId);
    this.$accessor.branchForm.setBranch(params.branch);
    this.$router.push(this.claimcasePath);
  }
}
