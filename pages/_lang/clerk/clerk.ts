import { Component, Vue } from 'vue-property-decorator';

@Component({
  layout: 'app',
  middleware: 'auth-clerk',
})
export default class Clerk extends Vue {}
