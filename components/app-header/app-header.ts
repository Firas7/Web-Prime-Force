import { Component, Vue } from 'vue-property-decorator';
import Login from '~/components/authentication/login/login';
import Register from '~/components/authentication/register/register';

@Component({
  components: {
    login: Login,
    register: Register,
  },
})
export default class AppHeader extends Vue {
  showLogin = false;

  showRegister = false;

  onSwitchToRegister() {
    this.showRegister = !this.showRegister;
    this.showLogin = !this.showLogin;
  }
}
