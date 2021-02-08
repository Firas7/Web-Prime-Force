import { Component, Vue } from 'vue-property-decorator';
import {
  BranchFormAnswerModel,
  BranchFormAnswer,
} from '~/models/branch-form/branch-form.model';
import { branchFormService } from '~/services/branch-form.service';
import ImageUpload from '~/components/claimcase/image-upload/image-upload';
import { ValidationErrors } from '~/models/validationErrors.enum';
import { validationService } from '~/services/validation.service';
import { Status } from '~/models/status.enum';
import { claimcaseService } from '~/services/claimcase.service';

@Component({
  layout: 'app',
  components: {
    imageUpload: ImageUpload,
  },
})
export default class Claimcase extends Vue {
  claimcases: string[] = ['KFZ', 'Feuer', 'Test'];
  branch: string = '';
  valid: boolean = true;
  file: File[] = [];
  claimId: string = '';
  menuDate: boolean = false;
  menuTime: boolean = false;

  constructor() {
    super();
    this.setUser();
  }

  get branchForm() {
    return this.$accessor.branchForm.branchForm;
  }
  get branchFormAnswerModel() {
    return this.$accessor.branchForm.branchFormAnswerModel;
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
    this.$accessor.branchForm.setStatus(status);
    this.$accessor.branchForm.setPartnerId(this.$accessor.user.getPartnerID);
    let response: BranchFormAnswerModel = {
      branch: this.branchForm.branch,
      version: this.branchForm.version,
      answers: [] as BranchFormAnswer[],
      status: this.branchFormAnswerModel.status,
      partnerId: this.branchFormAnswerModel.partnerId,
      contractId: this.branchFormAnswerModel.contractId,
    };

    this.branchForm.steps.forEach((element) => {
      element.fields.forEach((element) => {
        let answer: BranchFormAnswer = {
          id: element.id,
          value: element.value,
        };

        response.answers.push(answer);
      });
    });

    return response;
  }

  async submitForm() {
    if (confirm('Sind alle Daten richtig?')) {
      let rest = await branchFormService.postClaimResponse(
        await this.generateReponse(Status.PENDING)
      );
      if (rest.status === Status.SUCCESS) {
        await this.saveClaimcaseImages(rest.id, this.file);
        alert('Claim erfolgreich angelegt');
        this.$router.push('/admin/claim');
      }
    }
  }

  async saveFormData() {
    if (
      confirm(
        'Wollen sie Ihre Daten wirklich zwischenspeichern? Sie können später weitere Bilder hochladen.'
      )
    ) {
      let rest = await branchFormService.postClaimResponse(
        await this.generateReponse(Status.NONE)
      );
      if (rest.status === Status.SUCCESS) {
        await this.saveClaimcaseImages(rest.id, this.file);
        alert('Claim erfolgreich gespeichert.');
        this.$router.push('/admin/claim');
      }
    }
  }

  remove(index: number) {
    this.file.splice(index, 1);
  }

  changeBranch() {
    this.$accessor.branchForm.fetchBranchFormByVersion({
      branch: this.branch,
      version: '1.0',
    });
  }

  setUser() {
    this.$accessor.user.fetchUser(this.$accessor.accessToken.userId);
  }
}
