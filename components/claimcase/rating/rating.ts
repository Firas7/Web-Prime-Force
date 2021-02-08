import { Component, Prop, Vue, Emit } from 'nuxt-property-decorator';
import { BranchFormAnswerModel } from '~/models/branch-form/branch-form.model';

@Component
export default class Rating extends Vue {
  @Prop() formAnswer: BranchFormAnswerModel | undefined;

  get isInsured() {
    return this.$accessor.accessToken.isInsured;
  }

  stars: number = 0;
  comment: string = '';

  @Emit('saveRating')
  save() {
    if (this.comment == '') {
      this.comment = ' ';
    }
    return {
      stars: this.stars,
      comment: this.comment,
    };
  }
}
