import { Component, Emit, Vue } from 'vue-property-decorator';
import { UserGroup } from '~/models/user-group.enum';
import { WithRoute } from '~/router/withRoute';

@Component
export default class Headbarcomponent extends Vue implements WithRoute {
  @Emit('openMenu')
  openMenu() {
    return true;
  }

  get activeLanguage(): string {
    // @ts-ignore
    return this.$i18n.locale;
  }

  get isAdmin(): boolean {
    return this.$accessor.accessToken.getScope.includes(UserGroup.ADMIN);
  }

  logout() {
    localStorage.clear();
    window.location.reload(true);
    this.$router.push('/');
  }

  changeLanguage() {
    let route = '';
    if (this.activeLanguage === 'de') {
      route = this.$route.path.replace(/^\/[^\/]+/, '');
    } else {
      route = '/de' + this.$route.path;
    }
    this.$router.push(route);
  }

  search() {
    this.$router.push('/admin/');
  }

  message() {
    if (this.isAdmin) {
      this.$router.push('/admin/chats');
    } else {
      this.$router.push('/user/chats');
    }
  }
}
