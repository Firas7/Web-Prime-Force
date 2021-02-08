import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ClaimTable from '~/components/claimcase/claim-table/index.vue';
import ClaimCharts from '~/components/claimcase/claim-charts/index.vue';

@Component({
  layout: 'app',
  middleware: 'auth',
  components: {
    ClaimCharts: ClaimCharts,
    claimTable: ClaimTable,
  },
})
export default class Claim extends Vue {
  created() {}
}
