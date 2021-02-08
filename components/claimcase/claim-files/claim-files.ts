import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { BranchFormAnswerModel } from '../../../models/branch-form/branch-form.model';
import ImageUpload from '~/components/claimcase/image-upload/image-upload.vue';
import ImageCard from '~/components/claimcase/image-upload/image-card/index.vue';
import { claimcaseService } from '../../../services/claimcase.service';

@Component({
  components: {
    imageUpload: ImageUpload,
    imageCard: ImageCard,
  },
})
export default class ClaimFiles extends Vue {
  @Prop() formAnswer: BranchFormAnswerModel | undefined;
  icon: string = 'file-tick';
  iconClass: string = 'blue white--text';
  subtitle = 'DATE TEMP Jan 20, 2014';

  showImageCard: boolean = true;
  image: string = '';
  status: boolean = true;

  showFullImage(imageID: string) {
    if (this.formAnswer != null && this.formAnswer._id != null) {
      claimcaseService
        .getClaimcaseImage(this.formAnswer._id, imageID)
        .then((r) => {
          this.showImageCard = true;
          this.image = r.toString();
        });
    }
  }
}
