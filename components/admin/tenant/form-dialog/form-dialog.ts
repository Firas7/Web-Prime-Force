import { Component, Emit, Prop, PropSync, Vue } from 'vue-property-decorator';
import { ValidationErrors } from '~/models/validationErrors.enum';
import { validationService } from '~/services/validation.service';
import { TenantModel } from '~/models/tenant.model';

@Component
export default class FormDialog extends Vue {
  @PropSync('show', { type: Boolean })
  syncedShow!: boolean;

  @Prop()
  readonly tenant: TenantModel | undefined;

  @Prop()
  readonly editMode: boolean | undefined;

  tenantModel: Partial<TenantModel> = { ...this.tenant };

  valid: boolean = true;

  @Emit('addTenant')
  save() {
    this.syncedShow = false;
    let tenant = this.tenantModel;
    this.tenantModel = {} as TenantModel;
    return tenant;
  }

  @Emit('editTenant')
  edit() {
    this.syncedShow = false;
    return this.tenant;
  }

  @Emit('fetchTenants')
  closeDetailDialog() {
    this.tenantModel = {} as TenantModel;
    this.syncedShow = false;
  }

  choosenModel(): Partial<TenantModel> {
    return !!this.tenant && !!this.tenant._id ? this.tenant : this.tenantModel;
  }

  validateTextField(text: string): boolean | string | ValidationErrors {
    let validation = validationService.validateTextField(text);
    return validation === ValidationErrors.VALID
      ? true
      : ValidationErrors.TEXTFIELD_EMPTY;
  }
}
