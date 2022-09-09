import axios from 'axios';
import { TOKEN_KEY, getToken, saveToken }  from './jwt-token.jsx';

const { API_BASENAME, BROWSER, PORT = 3000 } = process.env;

class ApiClient {

  constructor(req) {
    if (BROWSER) {
      this.baseURL = API_BASENAME;
    } else {
      this.cookie = req.get('cookie');
      this.baseURL = `http://localhost:${PORT}${API_BASENAME}`;
    }
  }

  getConfig(config) {
    config.method = config.method || 'get';

    // Append correct `baseURL` to `config.url`
    if (config.baseURL === undefined) {
      config.url = config.url ? this.baseURL + config.url : this.baseURL;
    } else {
      config.url = config.url ? config.baseURL + config.url : config.baseURL;
    }

    // Add CORS credentials on browser side
    if (BROWSER) {
      config.withCredentials = (config.withCredentials === undefined) ?
        true : config.withCredentials;
    }

    // Copy cookies into headers on server side
    if (!BROWSER && this.cookie) config.headers = { cookie: this.cookie };

    const token = getToken();
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    return config;
  }

  async request(config = {}) {
    try {
      const { data, headers } = await axios(this.getConfig(config));
      if (headers['authorization']) {
        saveToken(headers['authorization']);
      }
      return data;
    } catch (error) {
      throw error && error.data || error.stack;
    }
  }

}

export default ApiClient;
