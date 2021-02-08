import { Component, Vue as Vue_ } from 'vue-property-decorator';
import ImageUpload from '~/components/claimcase/image-upload/image-upload';
import {
  BranchFormAnswer,
  BranchFormAnswerModel,
  BranchFormModel,
} from '~/models/branch-form/branch-form.model';
import { Status } from '~/models/status.enum';
import { ValidationErrors } from '~/models/validationErrors.enum';
import { branchFormService } from '~/services/branch-form.service';
import { claimcaseService } from '~/services/claimcase.service';
import { validationService } from '~/services/validation.service';
import { ContractModel } from '~/models/contract.model';
import { UserGroup } from '~/models/user-group.enum';
import Vue from 'vue';
@Component({
  layout: 'app',
  middleware: 'auth',
  components: {
    imageUpload: ImageUpload,
  },
})
export default class Claimcase extends Vue_ {
  contract: ContractModel = {} as ContractModel;

  cachedFormAnswers: BranchFormAnswerModel[] = [];
  newForm: boolean = true;
  choosenContract: boolean = false;

  branch: string = '';
  file: File[] = [];

  menuDate: boolean = false;
  menuTime: boolean = false;

  stepper: number = 0;
  vertical: boolean = true;

  errors = new Map();

  get branchForm(): BranchFormModel {
    return this.$accessor.branchForm.branchForm;
  }

  get branchFormAnswerModel(): BranchFormAnswerModel {
    return this.$accessor.branchForm.branchFormAnswerModel;
  }

  get contracts(): ContractModel[] {
    return this.$accessor.contract.contracts;
  }

  set branchFormAnswerModel(answerModel: BranchFormAnswerModel) {
    this.$accessor.branchForm.setBranchFormAnswerModel(answerModel);
  }

  get isInsured() {
    return this.$accessor.accessToken.isInsured;
  }

  error(message_: String) {
    this.$accessor.branchForm.initialise();
    (Vue as any).$toast.open({
      message: message_,
      type: 'error',
      duration: 3000,
      position: 'top-right',
    });
    this.$router.back();
  }
  created() {
    /*    if (
      this.$accessor.branchForm.branchForm == null ||
      this.$accessor.branchForm.branchForm.branch == null
    ) {
      this.error('Kein Formular für Branch vorhanden!');
    }*/
    !!this.branchFormAnswerModel.contractId &&
    !!this.branchFormAnswerModel.branch
      ? this.checkForCachedForms()
      : this.$accessor.user
          .fetchUser(this.$accessor.accessToken.userId)
          .then(() => {
            this.$accessor.contract.fetchUserContractsByPartnerId(
              this.$accessor.user.getPartnerID!
            );
          });
  }

  beforeDestroy() {
    this.$accessor.branchForm.initialise();
  }

  setBranch() {
    !!this.branchFormAnswerModel.contractId &&
    !!this.branchFormAnswerModel.branch
      ? (this.branch = this.branchFormAnswerModel.branch)
      : (this.branch = this.contract.branch);
    this.$accessor.branchForm
      .fetchBranchFormByVersion({
        branch: this.branch,
        version: '1.0',
      })
      .then(() => {
        if (
          this.$accessor.branchForm.branchForm == null ||
          this.$accessor.branchForm.branchForm.branch == null
        ) {
          this.error('Kein Formular für Branch vorhanden!');
        }
      });
  }

  loadAnswersIntoForm() {
    this.$accessor.branchForm
      .fetchBranchFormAnswerById(this.branchFormAnswerModel._id!)
      .then(() => {
        this.branchForm.steps.forEach((element) => {
          element.fields.forEach((element) => {
            this.branchFormAnswerModel.answers.forEach((answer) => {
              if (answer.id === element.id) {
                element.value = answer.value;
              }
            });
          });
        });
      });
    this.newForm = false;
    this.stepper = 0;
  }

  checkForCachedForms() {
    if (this.$accessor.accessToken.getScope.includes(UserGroup.INSURED)) {
      branchFormService
        .fetchClaimByPartnerId(this.$accessor.user.getPartnerID!)
        .then((claimcases) => {
          claimcases.forEach((claimcase) => {
            if (
              claimcase.status === Status.NONE &&
              (claimcase.contractId === this.contract._id ||
                claimcase.contractId === this.branchFormAnswerModel.contractId)
            ) {
              this.cachedFormAnswers.push(claimcase);
            }
          });
        });
    }
    this.choosenContract = true;
    this.setBranch();
  }

  validateDate(
    date: string,
    step: number,
    id: number
  ): boolean | string | ValidationErrors {
    const isvalid = validationService.validateDate(date, 'YYYY-MM-DD');
    if (this.errors.has(id) && isvalid === ValidationErrors.VALID) {
      this.errors.delete(id);
    }
    if (!this.errors.has(id) && isvalid === ValidationErrors.DATE_INVALIDE) {
      step--;
      this.errors.set(id, { step, isvalid });
    }
    return isvalid === ValidationErrors.VALID;
  }

  validateTextField(
    text: string,
    step: number,
    id: number
  ): boolean | string | ValidationErrors {
    const isvalid = validationService.validateTextField(text);

    if (this.errors.has(id) && isvalid === ValidationErrors.VALID) {
      this.errors.delete(id);
    }
    if (!this.errors.has(id) && isvalid === ValidationErrors.TEXTFIELD_EMPTY) {
      step--;
      this.errors.set(id, { step, isvalid });
    }
    return isvalid === ValidationErrors.VALID;
  }

  validStep(step: number): boolean {
    step--;
    let isValid = true;
    this.errors.forEach((value) => {
      if (value.step === step) {
        isValid = false;
      }
    });
    return isValid;
  }

  generateReponse(status: Status): BranchFormAnswerModel {
    this.$accessor.branchForm.setStatus(status);
    if (!!this.contract) {
      this.$accessor.branchForm.setPartnerId(this.$accessor.user.getPartnerID);
    }

    if (!this.branchFormAnswerModel.contractId) {
      this.$accessor.branchForm.setContractId(this.contract._id);
    }

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

  submitForm() {
    if (confirm('Sind alle Daten richtig?')) {
      this.newForm
        ? this.saveNewForm(Status.PENDING)
        : this.saveExistingForm(Status.PENDING);
    }
  }
  submitFormAsAdmin() {
    if (confirm('Wollen Sie abschicken?')) {
      this.saveNewFormAsAdmin();
    }
  }
  saveFormData() {
    if (confirm('Wollen sie Ihre Daten wirklich zwischenspeichern?')) {
      this.newForm
        ? this.saveNewForm(Status.NONE)
        : this.saveExistingForm(Status.NONE);
    }
  }

  saveNewForm(status: Status) {
    branchFormService
      .postClaimResponse(this.generateReponse(status))
      .then((response) => {
        this.saveClaimcaseImages(response.id, this.file).then(
          (uploadStatus) => {
            this.closeForm(response.status, uploadStatus!);
          }
        );
      });
  }

  saveNewFormAsAdmin() {
    branchFormService
      .postClaimResponseAsAdmin(this.generateReponse(Status.NONE))
      .then((response) => {
        this.saveClaimcaseImages(response.id, this.file).then(
          (uploadStatus) => {
            this.closeForm(response.status, uploadStatus!);
          }
        );
      });
  }

  saveExistingForm(status: Status) {
    let request = this.generateReponse(status);
    request.secret = this.branchFormAnswerModel.secret;
    branchFormService.putClaimResponse(request).then((updateStatus) => {
      this.saveClaimcaseImages(this.branchFormAnswerModel._id!, this.file).then(
        (uploadStatus) => {
          this.closeForm(updateStatus, uploadStatus!);
        }
      );
    });
  }

  async saveClaimcaseImages(id: string, files: File[]) {
    if (files.length !== 0) {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return await claimcaseService.putClaimcaseImages(id, formData);
      }
    }
  }

  closeForm(updateStatus: Status, uploadStatus: Status) {
    if (
      updateStatus === Status.SUCCESS &&
      uploadStatus === Status.SUCCESS &&
      this.file.length !== 0
    ) {
      alert(
        'Schadenfall erfolgreich gespeichert.\nEs wurde(n) ' +
          this.file.length +
          ' Datei(en) hochgeladen.'
      );
    } else if (updateStatus === Status.SUCCESS && this.file.length === 0) {
      alert(
        'Schadenfall erfolgreich gespeichert.\nEs wurden keine Dateien hochgeladen.'
      );
    } else {
      alert('Beim Speichern des Formulars ist ein Fehler aufgetreten');
    }
    this.$router.push('/claim');
  }

  remove(index: number) {
    this.file.splice(index, 1);
  }

  nextStep(nextStep: number) {
    this.stepper = ++nextStep;
  }
}
