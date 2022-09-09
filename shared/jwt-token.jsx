
export const TOKEN_KEY='ACTIONVIEW_JWT_TOKEN';

export function saveToken(token) {
  const newToken = token.indexOf('Bearer ') === 0 ? token.substr(7) : token;
  window.localStorage.setItem(TOKEN_KEY, newToken);
}

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
