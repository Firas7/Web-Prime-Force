import { Component, Vue, Prop } from 'vue-property-decorator';
import {
  BranchFormAnswerModel,
  BranchFormAnswer,
} from '~/models/branch-form/branch-form.model';
import { branchFormService } from '~/services/branch-form.service';
import { imageService } from '~/services/image.service';
import ImageUpload from '~/components/claimcase/image-upload/image-upload';
import { ValidationErrors } from '~/models/validationErrors.enum';
import { validationService } from '~/services/validation.service';
import { Status } from '~/models/status.enum';
import { claimcaseService } from '~/services/claimcase.service';

@Component({
  components: {
    imageUpload: ImageUpload,
  },
})
export default class Claimcase extends Vue {
  ready: boolean = false;
  secret: string = this.$nuxt.$route.params.detail;
  formAnswer: BranchFormAnswerModel | undefined;
  valid: boolean = true;
  file: File[] = [];
  oldFile: File[] = [];
  claimId: string = '';
  menuDate: boolean = false;
  menuTime: boolean = false;

  @Prop()
  status: boolean | undefined;

  constructor() {
    super();
    this.setClaim(this.secret);
  }

  get branchForm() {
    return this.$accessor.branchForm.branchForm;
  }

  validateDate(date: string): boolean | string | ValidationErrors {
    return validationService.validateDate(date, 'YYYY-MM-DD');
  }

  validateTextField(text: string): boolean | string | ValidationErrors {
    return validationService.validateTextField(text);
  }

  async saveClaimcaseImages(id: string, images: File[]) {
    if (images.length !== 0) {
      images.forEach(async (image) => {
        const formData = new FormData();
        formData.append('file', image, image.name);
        await claimcaseService.putClaimcaseImages(id, formData);
      });
    }
  }

  async generateReponse(status: Status): Promise<BranchFormAnswerModel> {
    let answers: BranchFormAnswer[] = [];

    this.branchForm.steps.forEach((element) => {
      element.fields.forEach((element) => {
        let answer: BranchFormAnswer = {
          id: element.id,
          value: element.value,
        };

        answers.push(answer);
      });
    });

    this.formAnswer!.answers = answers;
    this.formAnswer!.status = status;

    return this.formAnswer!;
  }

  async saveFormData() {
    if (
      confirm(
        'Wollen sie Ihre Daten wirklich zwischenspeichern? Sie können später weitere Bilder hochladen.'
      )
    ) {
      if (!(await this.generateReponse(Status.NONE))) {
        throw new Error('Form answer is not defined.');
      }
      let rest: Status = await branchFormService.putClaimResponse(
        this.formAnswer!
      );
      if (rest === Status.SUCCESS) {
        await this.saveClaimcaseImages(this.formAnswer!._id!, this.file);
        alert('Claim erfolgreich gespeichert.');
        this.$router.push('/self-claim');
      }
    }
  }

  async submitForm() {
    if (confirm('Sind alle Daten richtig?')) {
      if (!(await this.generateReponse(Status.PENDING))) {
        throw new Error('Form answer is not defined.');
      }
      this.formAnswer!.status = Status.PENDING;
      let rest = await branchFormService.putClaimResponse(this.formAnswer!);
      if (rest === Status.SUCCESS) {
        await this.saveClaimcaseImages(this.formAnswer!._id!, this.file);
        alert('Claim erfolgreich angelegt');
        this.$router.push('/self-claim');
      }
    }
  }

  remove(index: number) {
    this.file.splice(index, 1);
  }

  async setClaim(secret: string) {
    this.formAnswer = await branchFormService.fetchClaim(secret);
    await this.$accessor.branchForm.fetchBranchFormByVersion({
      branch: this.formAnswer.branch,
      version: this.formAnswer.version,
    });
    var step: any, field: any, answer: any;

    for (step of this.branchForm.steps) {
      for (field of step.fields) {
        answer = await this.formAnswer.answers.find(
          (answer) => answer.id === field.id
        );
        if (answer) {
          field.value = answer.value;
        }
      }
    }
    this.ready = true;
    if (this.formAnswer.images) {
      for (let image of this.formAnswer.images!) {
        this.oldFile.push(
          await imageService.getImageByClaimAndImageId(
            this.formAnswer._id,
            image.hd
          )
        );
      }
    }
  }
}
