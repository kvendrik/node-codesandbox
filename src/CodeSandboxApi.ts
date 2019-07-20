import axios, {AxiosRequestConfig} from 'axios';
import Datauri from 'datauri';

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

  async uploadBinaryFile(path: string, buffer: Buffer) {
    const datauri = new Datauri();
    datauri.format(path, buffer);
    const uri = datauri.content;
    try {
      const response = await this.request(
        'POST',
        '/users/current_user/uploads',
        {
          name: path,
          content: uri,
        },
      );
      return response.data.data.url;
    } catch (error) {
      throw new Error(`Could not upload file ${path}. ${error.response.data}`);
    }
  }
}

export default CodeSandboxApi;
