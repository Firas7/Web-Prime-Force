import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { BranchFormAnswerModel } from '~/models/branch-form/branch-form.model';
import { claimcaseService } from '~/services/claimcase.service';

@Component
export default class Schadenssumme extends Vue {
  @Prop() formAnswer: BranchFormAnswerModel | undefined;

  schadenssumme: number = 0;

  save() {
    if (this.formAnswer == null) {
      return;
    }
    let schadenssumme = this.schadenssumme;
    claimcaseService
      .addSchadenssumme(this.formAnswer._id, schadenssumme)
      .then(() => {
        if (
          confirm(
            'Der neue Schadenswert wird auf ' + schadenssumme + '€ festgelegt'
          )
        ) {
          alert('Schadenssumme wurde erfolgreich festgelegt');
        }
      });
  }
}
