import { Component, Vue } from 'vue-property-decorator';
import ClaimDetails from '~/components/claimcase/claim-details/index.vue';
import Statuscomponent from '~/components/common/status.component/index.vue';
import InsuredView from '~/components/insured/index.vue';
import { InsuredModel } from '../../../../models/insured.model';
import { BranchFormAnswerModel } from '../../../../models/branch-form/branch-form.model';
import { branchFormService } from '~/services/branch-form.service';
import ClaimAnswers from '~/components/claimcase/claim-answers/index.vue';
import ClaimFiles from '~/components/claimcase/claim-files/index.vue';
import Rating from '~/components/claimcase/rating/index.vue';
import { claimcaseService } from '~/services/claimcase.service';
import { RatingModel } from '~/models/rating.model';
import Schadenssumme from '~/components/claimcase/schadenssumme/index.vue';
import AuthComponent from '~/components/common/auth/index.vue';

@Component({
  layout: 'app',
  middleware: 'auth',
  components: {
    statuscomponent: Statuscomponent,
    claimDetails: ClaimDetails,
    insuredView: InsuredView,
    claimAnswers: ClaimAnswers,
    claimFiles: ClaimFiles,
    rating: Rating,
    schadenssumme: Schadenssumme,
    authComponent: AuthComponent,
  },
})
export default class ClaimDetail extends Vue {
  id: string = this.$nuxt.$route.params.detail;
  formAnswer: BranchFormAnswerModel = {} as BranchFormAnswerModel;
  tab: string = 'overview';
  detailPath: string = '/admin/detail/';
  get insured(): InsuredModel {
    return this.$accessor.insured.insured;
  }
  get branchForm() {
    return this.$accessor.branchForm.branchForm;
  }

  get isInsured() {
    return this.$accessor.accessToken.isInsured;
  }

  created() {
    this.loadClaim(this.id).then((r) => r);
  }

  showDetail(insured: InsuredModel) {
    this.$router.push({ path: this.detailPath + insured.partnerId });
  }

  saveRating(rating: RatingModel) {
    claimcaseService
      .addRating(this.formAnswer._id!, rating)
      .then(() => {
        alert('Vielen Dank für Ihre Bewertung!');
      })
      .then(() => {
        branchFormService
          .fetchClaimById(this.formAnswer._id!)
          .then((formAnswer) => {
            this.formAnswer = formAnswer;
          });
      });
  }

  async loadClaim(id: string) {
    this.formAnswer = await branchFormService.fetchClaimById(id);

    if (this.formAnswer != null && this.formAnswer.partnerId != null) {
      this.$accessor.insured
        .fetchInsuredByPartnerId(this.formAnswer.partnerId!)
        .then((r) => r);
    }

    await this.$accessor.branchForm.fetchBranchFormByVersion({
      branch: this.formAnswer.branch,
      version: this.formAnswer.version,
    });
  }
}
