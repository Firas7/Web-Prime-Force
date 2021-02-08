import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ImageCard from '~/components/claimcase/image-upload/image-card/index.vue';
import { claimcaseService } from '../../../services/claimcase.service';

@Component({
  components: {
    imageCard: ImageCard,
  },
})
export default class ImageUpload extends Vue {
  /*@Prop()
  readonly images: string[] | undefined;

  @Prop()
  readonly status: boolean | undefined;*/
  @Prop() id: string | undefined;

  private file: File[] = [];
  private url: string[] = [];

  showImageCard: boolean = true;
  image: string = '';

  tags = ['Schadensbericht', 'Versicherungsbericht'];
  preview() {
    this.url = [];
    this.file.forEach((imageFile) => {
      this.url.push(URL.createObjectURL(imageFile));
    });
  }

  saveClaimcaseImages() {
    if (this.file.length !== 0 && this.id) {
      for (const image of this.file) {
        const formData = new FormData();
        formData.append('file', image, image.name);
        formData.append('tags', this.tags.toString());
        claimcaseService.putClaimcaseImages(this.id, formData).then(() => {
          location.reload();
          //TODO BETTTER
        });
      }
    }
  }

  remove(index: number) {
    this.file.splice(index, 1);
    this.url.splice(index, 1);
  }

  showFullImage(image: string) {
    this.showImageCard = true;
    this.image = image;
  }
}
