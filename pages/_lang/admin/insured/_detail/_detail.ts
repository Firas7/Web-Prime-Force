import { Component, Vue } from 'vue-property-decorator';
import CreateInsured from '~/components/admin/insured/create-insured/create-insured';
import InsuredCard from '~/components/user/insured-card/insured-card';

@Component({
  middleware: 'auth-admin-agent-clerk',
  layout: 'app',
  components: {
    insuredCard: InsuredCard,
    createInsured: CreateInsured,
  },
})
export default class Detail extends Vue {
  updateAdmin: boolean = false;

  id: string = this.$nuxt.$route.params.detail;

  constructor() {
    super();
    if (this.id != '_detail') {
      this.updateAdmin = true;
    }
  }
}
