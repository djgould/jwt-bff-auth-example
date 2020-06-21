import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const http = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

createAuthRefreshInterceptor(http, (failedRequest => http.get('/api/refresh').then(resp => {
  const { accessToken } = resp.data;
  const bearer = `Bearer ${accessToken}`;
  http.defaults.headers.Authorization = bearer;
  failedRequest.response.config.headers.Authorization = bearer;
  return Promise.resolve();
})));

export default http;
