import moment from 'moment';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { GenerEnum } from '~/models/gener.enum';
import { InsuredModel } from '~/models/insured.model';

@Component
export default class InsuredView extends Vue {
  @Prop() insured!: InsuredModel | undefined;

  GenderEnum = GenerEnum;

  constructor() {
    super();
  }

  formatDate(date: string): string {
    return moment(date).format('DD.MM.YYYY');
  }
}
