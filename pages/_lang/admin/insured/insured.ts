import { Component, Vue } from '~/node_modules/vue-property-decorator';
import InsuredTable from '~/components/admin/insured/insured-table/insured-table';

@Component({
  middleware: 'auth-admin-agent-clerk',
  layout: 'app',
  components: {
    insuredTable: InsuredTable,
  },
})
export default class insured extends Vue {}
