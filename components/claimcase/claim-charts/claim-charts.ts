import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { ClaimcaseCountStateModel } from '../../../models/claimcase.model';

@Component({
  components: {},
})
export default class ClaimCharts extends Vue {
  tab: string = 'overview';

  get countByState(): ClaimcaseCountStateModel {
    return this.$accessor.claimcase.getCountsByState;
  }
  get isInsured() {
    return this.$accessor.accessToken.isInsured;
  }

  get paymentdata() {
    /*
    var grouped = this.$accessor.claimcase.getClaimCases.reduce(function (
      h: any,
      obj: ClaimcaseModel
    ) {
      h[obj.branch] = (h[obj.branch] || []).concat(obj);
      return h;
    },
    {});*/
    return this.columdata;
  }
  columdata = [
    {
      name: 'KFZ',
      data: [
        ['2020', 500],
        ['2021', 300],
        ['2022', 200],
      ],
    },
    {
      name: 'Hausrat',
      data: [
        ['2020', 24],
        ['2021', 22],
        ['2022', 19],
      ],
    },
    {
      name: 'Fahrrad',
      data: [
        ['2020', 20],
        ['2021', 23],
        ['2022', 29],
      ],
    },
  ];
  data = {
    '2018-05-13': 640,
    '2018-05-14': 200,
    '2018-05-15': 250,
    '2018-05-16': 350,
    '2018-05-17': 200,
    '2018-05-18': 670,
    '2018-05-19': 600,
    '2018-05-20': 800,
    '2018-05-21': 900,
    '2018-05-22': 820,
    '2018-05-23': 1340,
    '2018-05-24': 100,
  };

  constructor() {
    super();
    this.$accessor.claimcase.fetchCountsByState();
  }
}
