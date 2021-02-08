import moment from 'moment';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ContractModel } from '~/models/contract.model';

@Component
export default class ContractView extends Vue {
  @Prop() contracts: ContractModel[] | undefined;

  @Prop({ required: true })
  readonly detailPath: string | undefined;

  constructor() {
    super();
  }

  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
  }

  showDetail(contract: ContractModel) {
    this.$router.push(this.detailPath + '/' + contract._id);
  }
}
