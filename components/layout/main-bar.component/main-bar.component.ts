import { Component, Emit, Vue } from 'vue-property-decorator';
import { UserGroup } from '~/models/user-group.enum';
import { WithRoute } from '~/router/withRoute';

@Component
export default class Mainbarcomponent extends Vue implements WithRoute {
  isInsured = false;

  @Emit('closeMenu')
  closeMenu() {
    return false;
  }

  get id(): string {
    return this.$nuxt.$route.path;
  }

  get scopeAdmin(): boolean {
    const scope: UserGroup[] = this.$accessor.accessToken.getScope;
    this.isInsured = scope.includes(UserGroup.INSURED);
    return scope.includes(UserGroup.ADMIN);
  }

  get scopeAdminClerkAgent(): boolean {
    const scope: UserGroup[] = this.$accessor.accessToken.getScope;
    this.isInsured = scope.includes(UserGroup.INSURED);
    return (
      scope.includes(UserGroup.ADMIN) ||
      scope.includes(UserGroup.CLERK) ||
      scope.includes(UserGroup.AGENT)
    );
  }

  get scopeAll(): boolean {
    const scope: UserGroup[] = this.$accessor.accessToken.getScope;
    this.isInsured = scope.includes(UserGroup.INSURED);
    return (
      scope.includes(UserGroup.INSURED) ||
      scope.includes(UserGroup.ADMIN) ||
      scope.includes(UserGroup.CLERK) ||
      scope.includes(UserGroup.AGENT)
    );
  }

  get scopeInsured(): boolean {
    const scope: UserGroup[] = this.$accessor.accessToken.getScope;
    return scope.includes(UserGroup.INSURED);
  }

  navigatTo(param: string) {
    this.$router.push('/' + param);
    this.closeMenu();
  }

  isActive(param: string): boolean {
    return this.$nuxt.$route.path === '/' + param;
  }
}
