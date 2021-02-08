import { Component, Vue } from '~/node_modules/vue-property-decorator';
import { InsuredModel } from '~/models/insured.model';
import { insuredService } from '~/services/insured.service';
import { Status } from '~/models/status.enum';
import moment from 'moment';

@Component({
  layout: 'app',
})
export default class InsuredTable extends Vue {
  insureds: InsuredModel[] = [];

  beginAtIndex: number = 0;

  insuredDeleted: boolean = false;

  loading: boolean = true;

  constructor() {
    super();
    this.initialize(0, 100);
  }

  initialize(beginAtIndex: number, limit: number) {
    insuredService
      .getInsured(beginAtIndex, limit)
      .then((response: InsuredModel[]) => {
        this.loading = false;
        response.forEach((insureds) => {
          this.insureds.push(insureds);
        });

        if (this.beginAtIndex === 0) {
          this.beginAtIndex = response.length;
        }
      });
  }

  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
  }

  loadNextInsured(limit: number) {
    this.initialize(this.beginAtIndex, limit);
    this.beginAtIndex += limit;
  }

  addInsured() {
    this.$router.push('/admin/insured/_detail');
  }

  editInsured(item: InsuredModel) {
    const insuredId = this.insureds[this.insureds.indexOf(item)]._id;
    if (!this.insuredDeleted) {
      this.$router.push('/admin/insured/' + insuredId);
    } else {
      this.insuredDeleted = false;
    }
  }

  deleteInsured(item: InsuredModel) {
    const index = this.insureds.indexOf(item);
    const insuredId: string = this.insureds[index]._id!;

    confirm('Are you sure you want to delete this insured?') &&
      insuredService.deleteInsured(insuredId).then((status) => {
        if (status === Status.SUCCESS) {
          this.insureds.splice(index, 1);
        } else {
          alert('Failed');
        }
      });
    this.insuredDeleted = true;
  }

  showDetail(item: InsuredModel) {
    const insuredId = this.insureds[this.insureds.indexOf(item)]._id;
    if (!this.insuredDeleted) {
      this.$router.push('/admin/insured/' + insuredId);
    } else {
      this.insuredDeleted = false;
    }
  }
}
