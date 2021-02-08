import {
  Component,
  Vue,
  Prop,
  PropSync,
  Emit,
} from '~/node_modules/vue-property-decorator';
import { TenantModel } from '~/models/tenant.model';
import FormDialog from '~/components/admin/tenant/form-dialog/index.vue';

@Component({
  components: {
    formDialog: FormDialog,
  },
})
export default class TenantsTable extends Vue {
  @Prop()
  readonly tenants: TenantModel[] | undefined;

  @Prop()
  readonly documents: number | undefined;

  @Prop()
  readonly loading: boolean | undefined;

  @Prop()
  readonly itemsPerPage: number[] | undefined;

  @PropSync('change', { type: Number })
  limit!: number;

  //Hier nichts ändern
  editMode: boolean = false;
  showDialog: boolean = false;
  startIndex: number = 0;
  endIndex: number = 0;
  tenantDelete: boolean = false;

  tenant: TenantModel = {} as TenantModel;

  created() {
    if (!!this.documents && !!this.tenants) {
      this.endIndex = this.limit;
    }
  }

  @Emit('fetchTenants')
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

  @Emit('fetchTenants')
  previousPage() {
    if (this.startIndex !== 0) {
      this.startIndex -= this.limit;
      this.endIndex === this.documents
        ? (this.endIndex = this.startIndex + this.limit)
        : (this.endIndex -= this.limit);
    }
    return { startIndex: this.startIndex, limit: this.limit };
  }

  showFormDialog() {
    this.showDialog = true;
    this.editMode = false;
  }

  showAddDialog() {
    this.tenant = {
      firstname: '',
      lastname: '',
      url: '',
      pathname: '',
    } as TenantModel;
    this.showDialog = true;
    this.editMode = false;
  }

  showEditDialog(tenant: TenantModel) {
    if (!this.tenantDelete) {
      this.tenant = tenant;
      this.editMode = true;
      this.showDialog = true;
    }
  }

  @Emit('deleteTenant')
  deleteTenant(id: string) {
    this.startIndex = 0;
    this.endIndex = this.limit;
    this.tenantDelete = true;
    return id;
  }

  @Emit('fetchTenants')
  changeLimit(limit: number) {
    this.startIndex = 0;
    this.endIndex = limit;
    return { startIndex: this.startIndex, limit: limit };
  }

  @Emit('addTenant')
  addTenant(tenant: TenantModel) {
    this.startIndex = 0;
    this.endIndex = this.limit;
    return tenant;
  }

  @Emit('editTenant')
  editTenant(tenant: TenantModel) {
    this.startIndex = 0;
    this.endIndex = this.limit;
    return tenant;
  }
}
