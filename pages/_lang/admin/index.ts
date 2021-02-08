import { Component, Vue } from 'vue-property-decorator';
import { SearchResult } from '../../../models/search.model';
import Search from '~/components/admin/search/index.vue';
@Component({
  layout: 'app',
  middleware: 'auth-admin-agent-clerk',

  components: {
    'search-result-card': Search,
  },
})
export default class Index extends Vue {
  limit: number = 20;
  startIndex: number = 0;
  endIndex: number = this.limit;
  page = 1;
  isFormValid = false;

  rules = [
    (v: string) => !!v || 'Required',
    (v: string) =>
      this.checklength(v) || 'Jedes Teilwort muss größer als 3 Zeichen sein',
  ];

  private checklength(test: string): boolean {
    if (test.length < 4) {
      return false;
    }
    let array = test.split(' ');
    for (let index = 0; index < array.length; index++) {
      if (array[index].length < 4) {
        return false;
      }
    }

    return true;
  }

  get searchResults(): SearchResult {
    return this.$accessor.adminSearch.searchResults;
  }

  get pages(): number {
    let pages =
      this.searchResults.length_total / this.searchResults.length_page;
    return Math.round(pages);
  }

  searchTerm: string = '';

  created() {
    this.$accessor.adminSearch.initialise();
  }

  search(searchTerm: string) {
    if (this.isFormValid) {
      this.$accessor.adminSearch.initialise();

      this.$accessor.adminSearch.fetchSearchResults({
        searchTerm: searchTerm,
        startIndex: this.startIndex,
        limit: this.endIndex,
      });
    }
  }

  openDetail(partnerID: string) {
    this.$router.push('/admin/detail/' + partnerID + '?activeTab=insured');
  }

  next(page: number) {
    page -= 1;
    if (this.startIndex === page * this.limit) {
      return;
    }
    this.startIndex = page * this.limit;
    this.endIndex = page * this.limit + this.limit;
    this.search(this.searchTerm);
  }
}
