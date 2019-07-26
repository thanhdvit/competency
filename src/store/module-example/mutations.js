export function authSuccess(state, data) {
  state.isAuthenticated = true;
  state.token = data.token;
  state.userID = data.tokenInfo.userID;
  state.userCode = data.tokenInfo.username;
}

export function logout(state, callback) {
  state.isAuthenticated = false;
  state.token = '';
  if (typeof callback === 'function') {
    callback();
  }
}
