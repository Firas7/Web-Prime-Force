import { Component, Vue } from 'vue-property-decorator';
import Login from '~/components/authentication/login/index.vue';
import Register from '~/components/authentication/register/index.vue';

@Component({
  components: {
    login: Login,
    register: Register,
  },
})
export default class Index extends Vue {
  showLogin: boolean = false;

  showRegister: boolean = false;

  links = ['Privacy Policy', 'Impressum'];

  footerBtn(link: String) {
    if (link === 'Impressum') {
      this.$router.push('/impressum');
    }
    if (link === 'Privacy Policy') {
      this.$router.push('/privacy');
    }
  }

  onSwitchToRegister() {
    this.showRegister = !this.showRegister;
    this.showLogin = !this.showLogin;
  }

  changeLanguage() {
    let route = '';
    if (this.activeLanguage === 'de') {
      route = this.$route.path.replace(/\/de/, '/');
    } else {
      route = '/de';
    }
    this.$router.push(route);
  }

  get activeLanguage() {
    // @ts-ignore
    return this.$i18n.locale;
  }
}
