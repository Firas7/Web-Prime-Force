import { Component, Vue } from 'vue-property-decorator';
import { ClerkModel } from '~/models/clerk.model';

@Component
export default class Clerk extends Vue {
  get clerk(): ClerkModel {
    return this.$accessor.clerk.clerk;
  }

  created() {
    if (!!this.$accessor.user.getPartnerID) {
      this.$accessor.clerk.fetchClerkByPartnerId(
        this.$accessor.user.getPartnerID
      );
    }
  }
}
