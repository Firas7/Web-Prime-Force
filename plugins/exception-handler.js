import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

Vue.use(VueToast);

//old, maby for the future:
//Vue.config.errorHandler = (err, vm, info) => {
Vue.config.errorHandler = (err) => {
  switch (err.message) {
    case 'SUCCESS':
      openTaoster('SUCCESS', 'success');
      return true;
    case 'UNKNOWN_USER':
      openTaoster('UNKNOWN_USER', 'error');
      return true;
    case 'UNKNOWN_ERROR':
      openTaoster('UNKNOWN_ERROR', 'error');
      return true;
  }

  openTaoster(err.message, 'error');
  return true;

  //return vm;
};

function openTaoster(message, type) {
  Vue.$toast.open({
    message: message,
    type: type,
    duration: 3000,
    position: 'top-right',
  });
}
