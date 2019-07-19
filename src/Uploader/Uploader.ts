import CodesandboxApi from '../CodeSandboxApi';
import {resolveIncludes, filterExcludes} from './utilities/paths';
import {
  resolveFiles,
  constructModulesFromFiles,
} from './utilities/file-resolver';
import createSandbox from 'codesandbox-import-utils/lib/create-sandbox';
import {Config} from './types';

class Uploader {
  private api: CodesandboxApi;

  constructor(token: string) {
    if (!token) {
      throw new Error(
        `
        No API token given:
        1. Navigate to https://codesandbox.io/cli/login.
        2. Navigate to https://codesandbox.io/api/v1/auth/verify/[YOUR_TOKEN].
        3. Use the token that you get from the endpoint here.
      `,
      );
    }
    const api = new CodesandboxApi();
    api.setToken(token);
    this.api = api;
  }

  async upload(
    path: string,
    {include, exclude, files: additionalFiles}: Config = {},
  ) {
    const includePaths = resolveIncludes(path, include);
    const finalPaths = filterExcludes(includePaths, exclude);
    const modules = constructModulesFromFiles({
      ...resolveFiles(path, finalPaths),
      ...additionalFiles,
    });
    const sandbox = await createSandbox(modules);
    const response = await this.api.request('POST', '/sandboxes', {
      sandbox,
    });
    const sandboxId = response.data.data.alias;
    return {
      response,
      sandboxUrl: `https://codesandbox.io/s/${sandboxId}`,
    };
  }
}

export default Uploader;
