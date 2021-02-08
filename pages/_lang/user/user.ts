import { Component, Vue } from 'nuxt-property-decorator';
import { UserModel } from '~/models/user.model';
import InsuredCard from '~/components/user/insured-card/insured-card.vue';
import UserCard from '~/components/user/user-card/user-card.vue';
import { InsuredModel } from '~/models/insured.model';

@Component({
  layout: 'app',
  middleware: 'auth-insured',
  components: {
    userCard: UserCard,
    insuredCard: InsuredCard,
  },
})
export default class User extends Vue {
  state: number = 0;

  insuredExists: boolean = false;

  get user(): UserModel {
    return this.$accessor.user.user;
  }

  get insured(): InsuredModel {
    return this.$accessor.insured.insured;
  }

  created() {
    this.$accessor.user
      .fetchUser(this.$accessor.accessToken.userId)
      .then(() => {
        if (!!this.user.linkedPartner) {
          this.$accessor.contract.fetchUserContractsByPartnerId(
            this.user.linkedPartner.partnerId
          );
          this.$accessor.insured.fetchInsuredByPartnerIdInUser(
            this.user.linkedPartner.partnerId
          );
          this.insuredExists = true;
        }
      });
  }

  changeState(state: number) {
    this.state = state;
  }

  isActive(state: number): boolean {
    return this.state === state;
  }
}
