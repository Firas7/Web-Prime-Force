import { Component, Vue } from '~/node_modules/vue-property-decorator';
import { TenantModel } from '~/models/tenant.model';
import TenantsTable from '~/components/admin/tenant/tentant-table/index.vue';

@Component({
  middleware: 'auth-admin-agent-clerk',
  layout: 'app',
  components: {
    tenantsTable: TenantsTable,
  },
})
export default class tenants extends Vue {
  get tenants(): TenantModel[] {
    return this.$accessor.tenant.tenants;
  }

  get documents(): number {
    return this.$accessor.tenant.documents;
  }

  $i18n: any;
  limit: number = 20;
  itemsPerPage = [10, 20, 30, 40, 50];
  loading: boolean = false;

  created() {
    this.fetchTenants({ startIndex: 0, limit: this.limit });
  }

  fetchTenants(pageParams: { startIndex: number; limit: number }) {
    this.loading = true;
    this.$accessor.tenant
      .fetchTenants({
        startIndex: pageParams.startIndex,
        limit: pageParams.limit,
      })
      .then(() => {
        this.loading = false;
      });
  }

  deleteTenant(id: string) {
    if (
      confirm(this.$i18n.t('pages.admin.tenants.index.messages.deleteMessage'))
    ) {
      this.$accessor.tenant.deleteTenant({
        id: id,
        startIndex: 0,
        limit: this.limit,
      });
    }
  }

  addTenant(tenant: TenantModel) {
    this.$accessor.tenant.saveTenant({
      tenant: tenant,
      startIndex: 0,
      limit: this.limit,
    });
  }

  editTenant(tenant: TenantModel) {
    this.$accessor.tenant.editTenant({
      tenant: tenant,
      startIndex: 0,
      limit: this.limit,
    });
  }
}
