import axios from 'axios';
import isUndefined from 'lodash/lang/isUndefined';

const { BROWSER, PORT = 3000 } = process.env;

class ApiClient {

  constructor(req) {
    if (BROWSER) {
      this.baseURL = '/api';
    } else {
      this.cookie = req.get('cookie');
      this.baseURL = `http://localhost:${PORT}/api`;
    }
  }

  getConfig(config) {
    config.method = config.method || 'get';

    // Append correct `baseURL` to `config.url`
    if (isUndefined(config.baseURL)) {
      config.url = config.url ? this.baseURL + config.url : this.baseURL;
    } else {
      config.url = config.url ? config.baseURL + config.url : config.baseURL;
    }

    // Add CORS credentials on browser side
    if (BROWSER) {
      config.withCredentials = isUndefined(config.withCredentials) && true || config.withCredentials;
    }

    // Copy cookies into headers on server side
    if (!BROWSER && this.cookie) config.headers = {cookie: this.cookie};

    return config;
  }

  async request(config = {}) {
    config = this.getConfig(config);
    try {
      const { data } = await axios(config);
      return data;
    } catch(error) {
      throw error && error.data || error.stack;
    }
  }

}

export default ApiClient;
