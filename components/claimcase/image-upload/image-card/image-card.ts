import Vue from 'vue';
import { Prop, PropSync, Component } from 'vue-property-decorator';

@Component
export default class ImageCard extends Vue {
  @PropSync('show', { type: Boolean })
  syncedShow!: boolean;

  @Prop()
  readonly image: string | undefined;

  @Prop()
  readonly status: boolean | undefined;

  close() {
    this.syncedShow = false;
  }
}
