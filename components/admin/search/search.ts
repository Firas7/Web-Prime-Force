import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { SearchModel } from '~/models/search.model';

@Component
export default class Search extends Vue {
  @Prop() searchResult!: SearchModel | undefined;
}
