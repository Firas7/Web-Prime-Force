import Vue from 'vue';
import { ClaimcaseModel } from '~/models/claimcase.model';
import Statuscomponent from '~/components/common/status.component/index.vue';
import { Component } from 'vue-property-decorator';
import FormDialog from '../../admin/contracts/form-dialog/form-dialog';
import moment from '~/node_modules/moment';

@Component({
  components: {
    formDialog: FormDialog,
    statuscomponent: Statuscomponent,
  },
})
export default class ClaimTable extends Vue {
  get claimcases(): ClaimcaseModel[] {
    //this.dofilter('');
    return this.$accessor.claimcase.getClaimCases;
  }
  get isInsured() {
    return this.$accessor.accessToken.isInsured;
  }

  constructor() {
    super();
    this.filteredItems = [];
    this.$accessor.claimcase.initialise({} as ClaimcaseModel);
    this.$accessor.claimcase.fetchClaimCases().then(() => {
      this.filteredItems = this.$accessor.claimcase.getClaimCases;
    });
  }

  filteredItems: ClaimcaseModel[];
  loading: boolean = false;
  detailPath: string = 'claim';

  pagination: any = {
    descending: true,
    page: 1,
    rowsPerPage: 4,
    sortBy: 'fat',
    totalItems: 0,
    rowsPerPageItems: [1, 2, 4, 8, 16],
  };

  filter = ['NONE', 'PENDING', 'SUCCESS', 'PROGRESS', 'FINISHED', 'DECLINED'];

  get headers() {
    if (this.isInsured) {
      return [
        {
          text: 'branch',
          align: 'center',
          sortable: true,
          value: 'branch',
        },
        {
          text: 'status',
          align: 'center',
          sortable: true,
          value: 'status',
        },
        {
          text: 'Auszahlung',
          align: 'center',
          sortable: true,
          value: 'schadenssumme',
        },
      ];
    } else {
      return [
        {
          text: 'branch',
          align: 'center',
          sortable: true,
          value: 'branch',
        },
        {
          text: 'status',
          align: 'center',
          sortable: true,
          value: 'status',
        },
        {
          text: 'partnerId',
          align: 'center',
          sortable: true,
          value: 'partnerId',
        },
      ];
    }
  }

  created() {
    this.filteredItems = this.claimcases;
  }

  showDetail(value: ClaimcaseModel) {
    this.$router.push(this.detailPath + '/' + value._id);
  }

  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
  }

  dofilter(filter: string) {
    if (this.claimcases === undefined) {
      this.filteredItems = [];
      return;
    }
    if (filter === undefined) {
      this.filteredItems = this.claimcases;
      return;
    }
    if (filter === '') {
      this.filteredItems = this.claimcases;
      return;
    }
    this.filteredItems = this.claimcases.filter((i) => {
      return i.status === filter;
    });
  }

  getColor(status: string) {
    return status;
  }
}
