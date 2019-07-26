export default async ({ Vue }) => {
  if (window.webpackHotUpdate) {
    Vue.prototype.$webapiPath = 'http://localhost:10543/webapi';
  } else {
    Vue.prototype.$webapiPath = 'https://dtg.com.vn:10543/webapi';
  }

  Vue.prototype.isValidJwt = (token) => {
    try {
      const tokenInfor = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() / 1000 <= tokenInfor.exp) {
        return true;
      }
    } catch (err) {
      return err;
    }

    return false;
  };
};
