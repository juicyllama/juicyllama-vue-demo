/* global window, FB, document */

export function loadFbSdk() {
  return new Promise(resolve => {
    window.fbAsyncInit = function () { // eslint-disable-line func-names
      FB.init({
        appId: process.env.VUE_APP_FACEBOOK_APP_ID,
        xfbml: false,
        version: 'v10.0',
        cookie: true
      });
      FB.AppEvents.logPageView();
      resolve('SDK Loaded!');
    };
    (function (d, s, id) { // eslint-disable-line func-names
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      const js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
}

export function getLoginStatus() {
  return new Promise(resolve => {
    FB.getLoginStatus(responseStatus => {
      resolve(responseStatus);
    })
  })
}

export function fbLogin(options) {
  return new Promise(resolve => {
    FB.login(response => resolve(response), options);
  });
}
export function fbLogout(response) {
  return new Promise(resolve => {
    FB.logout(logoutResponse => resolve(logoutResponse), response)
  })
}
