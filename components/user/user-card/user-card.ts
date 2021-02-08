import { Component, Vue } from 'nuxt-property-decorator';
import Clerk from '~/components/user/clerk/clerk';
import { ContractModel } from '~/models/contract.model';
import { UserModel } from '~/models/user.model';
import { ValidationErrors } from '~/models/validationErrors.enum';
import { validationService } from '~/services/validation.service';
import InsuredAgent from '~/components/user/insuredAgent/insuredAgent';
import { InsuredModel } from '~/models/insured.model';
import { AgentModel } from '~/models/agent.model';

@Component({
  layout: 'app',
  components: {
    clerk: Clerk,
    insuredAgent: InsuredAgent,
  },
})
export default class UserCard extends Vue {
  edit = false;

  confirmed = true;

  partnerId: string = '';

  partnerIdCode: string = '';

  componentKey: number = 0;

  hasClerk: boolean = false; //!!this.$accessor.user.getPartnerID;

  hasAgent: boolean = false;

  get user(): UserModel {
    return this.$accessor.user.user;
  }

  get insured(): InsuredModel {
    return this.$accessor.insured.insured;
  }

  get agent(): AgentModel {
    return this.$accessor.agent.agent;
  }

  get contracts(): ContractModel[] {
    return this.$accessor.contract.contracts;
  }

  created() {
    this.$accessor.user
      .fetchUser(this.$accessor.accessToken.userId)
      .then(() => {
        if (!!this.user.linkedPartner) {
          this.$accessor.contract.fetchUserContractsByPartnerId(
            this.user.linkedPartner.partnerId
          );
          this.$accessor.insured
            .fetchInsuredByPartnerIdInUser(this.user.linkedPartner.partnerId)
            .then(() => {
              if (!!this.user.linkedPartner && !!this.insured.agentId) {
                this.$accessor.agent
                  .fetchAgentByPartnerId(this.user.linkedPartner.partnerId)
                  .then(() => {
                    this.hasAgent = !!this.$accessor.agent.agent;
                  });
              }
              if (!!this.user.linkedPartner && !!this.insured.clerkId) {
                this.hasClerk = true;
              }
            });
        }
      });
  }

  switchEdit() {
    this.edit = !this.edit;
  }

  submitPartnerID() {
    this.$accessor.user.addPartnerId(this.partnerId);
  }

  submitPartnerIdCode() {
    this.$accessor.user.confirmPartnerId(this.partnerIdCode);
  }

  submitEditProfile() {
    const validateEmail = validationService.validateEmail(this.user.email);
    if (validateEmail === true) {
      this.$accessor.user.updateUser(this.user);
      this.edit = false;
    } else {
      throw new Error(ValidationErrors.EMAIL_INVALID);
    }
  }

  async deleteData() {
    alert('Ein Antrag zur Löschung ihrer Daten wurde eingereicht.');
  }
}
