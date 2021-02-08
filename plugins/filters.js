import Vue from 'vue';
import moment from 'moment';
import numeral from 'numeral';

numeral.register('locale', 'de', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
  },
  currency: {
    symbol: '€',
  },
});

numeral.register('locale', 'us', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
  },
  currency: {
    symbol: '$',
  },
});

Vue.filter('formatDate', function (value) {
  if (value) {
    var userLang = navigator.language || navigator.userLanguage;
    if (userLang === 'de-DE') {
      moment.locale('de');
    } else {
      moment.locale('us');
    }
    return moment(String(value)).format('MM/DD/YYYY hh:mm');
  }
});

Vue.filter('formatMoney', function (value) {
  if (value) {
    var userLang = navigator.language || navigator.userLanguage;
    if (userLang === 'de-DE') {
      numeral.locale('de');
      return numeral(value).format('0.00$');
    } else {
      numeral.locale('us');
      return numeral(value).format('$0.00');
    }
  }
});

Vue.filter('formatDecimal', function (value) {
  if (value) {
    var userLang = navigator.language || navigator.userLanguage;
    if (userLang === 'de-DE') {
      numeral.locale('de');
    } else {
      numeral.locale('us');
    }
    return numeral(value).format();
  }
});
