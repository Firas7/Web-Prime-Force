import axios from 'axios';
import Vue from 'vue';

function errorResponseHandler(error) {
  // if has response show the error
  if (error.response) {
    let errMessage = 'UNKOWN_ERROR';
    if (error.response.data != null && error.response.data.message != null) {
      errMessage = error.response.data.message;
    }
    Vue.$toast.open({
      message: errMessage,
      type: 'error',
      duration: 3000,
      position: 'top-right',
    });
  }
}

axios.interceptors.request.use((config) => {
  const wildcards = ['authenticate', 'reset', 'recover', 'register'];
  var includedInURL = false;

  wildcards.forEach((wildcard) => {
    if (config.url.includes(wildcard)) {
      includedInURL = true;
    }
  });

  if (includedInURL) {
    return config;
  }

  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});
// apply interceptor on response
axios.interceptors.response.use((response) => response, errorResponseHandler);
export default errorResponseHandler;
