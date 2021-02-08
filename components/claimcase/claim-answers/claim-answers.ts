import { Component, Vue, Prop } from 'nuxt-property-decorator';
import StatusComponent from '~/components/common/status.component/index.vue';
import { BranchFormQuestionAnswer } from '../../../models/branch-form/branch-form.model';
import {
  BranchFormAnswerModel,
  BranchFormModel,
} from '../../../models/branch-form/branch-form.model';

@Component({
  components: {
    statuscomponent: StatusComponent,
  },
})
export default class ClaimAnswers extends Vue {
  @Prop() formAnswer: BranchFormAnswerModel | undefined;

  @Prop() form!: BranchFormModel | undefined;
  answers: BranchFormQuestionAnswer[] = [];

  created() {
    var step: any, field: any, answer: any;
    if (this.form == null) {
      return;
    }
    if (this.formAnswer == null) {
      return;
    }
    for (step of this.form.steps) {
      for (field of step.fields) {
        answer = this.formAnswer.answers.find(
          (answer) => answer.id === field.id
        );
        if (answer) {
          //field.value = answer.value;
          let ans: BranchFormQuestionAnswer = {
            answer: answer.value,
            question: field.attributes.label,
          };
          this.answers.push(ans);
        }
      }
    }
  }
}
