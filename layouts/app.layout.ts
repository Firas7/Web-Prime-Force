import { Component, Vue } from 'nuxt-property-decorator';
import Headbarcomponent from '../components/layout/head-bar.component/index.vue';
import Mainbarcomponent from '../components/layout/main-bar.component/index.vue';

@Component({
  components: {
    mainbar: Mainbarcomponent,
    headerbar: Headbarcomponent,
  },
})
export default class App extends Vue {
  isMenuOpenState: boolean = false;

  setMenu(value: boolean) {
    this.isMenuOpenState = value;
  }
}
