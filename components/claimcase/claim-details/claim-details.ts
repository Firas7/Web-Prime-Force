import { Component, Vue, Prop } from 'nuxt-property-decorator';
import StatusComponent from '~/components/common/status.component/index.vue';
import { claimcaseService } from '~/services/claimcase.service';
import { Status } from '~/models/status.enum';
import {
  BranchFormAnswerModel,
  BranchFormModel,
} from '../../../models/branch-form/branch-form.model';

@Component({
  components: {
    statuscomponent: StatusComponent,
  },
})
export default class ClaimDetails extends Vue {
  @Prop() formAnswer: BranchFormAnswerModel | undefined;
  @Prop() form!: BranchFormModel | undefined;

  status_dropdown: Status[] = [
    Status.NONE,
    Status.DECLINED,
    Status.FINISHED,
    Status.PENDING,
    Status.PROGRESS,
    Status.SUCCESS,
  ];
  newStatus: Status = this.$accessor.claimcase.getStatus;
  id: string = this.$nuxt.$route.params.detail;

  get isInsured() {
    return this.$accessor.accessToken.isInsured;
  }

  created() {}

  setClaimcaseStatus() {
    if (this.formAnswer != null) {
      claimcaseService.putClaimcaseStatus(this.id, this.formAnswer.status);
    }
  }
}
