import axios, {AxiosRequestConfig} from 'axios';

class CodeSandboxApi {
  private token: string;

  setToken(token: string) {
    this.token = token;
  }

  request(
    method: AxiosRequestConfig['method'],
    endpoint: string,
    data?: AxiosRequestConfig['data'],
  ) {
    return axios({
      url: `https://codesandbox.io/api/v1${endpoint}`,
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data,
      responseType: 'json',
    });
  }
}

export default CodeSandboxApi;
