import {homedir} from 'os';
import {writeFileSync, readJSONSync, existsSync} from 'fs-extra';
import {resolve} from 'path';
import CodeSandboxApi from '../CodeSandboxApi';
import ms from 'ms';

const api = new CodeSandboxApi();

const TTL = ms('8h');
export const configPath = resolve(homedir(), '.codesandbox.json');

export async function getToken() {
  if (!existsSync(configPath)) {
    return null;
  }

  const {lastUpdate, token} = readJSONSync(configPath);
  const tokenNeedsValidation = Date.now() - lastUpdate > TTL;

  if (tokenNeedsValidation) {
    if (await validateToken(token)) {
      setToken(token);
    } else {
      setToken(null);
      return null;
    }
  }

  return token;
}

export function setToken(token: string | null) {
  return writeFileSync(
    configPath,
    JSON.stringify({
      lastUpdate: Date.now(),
      token,
    }),
  );
}

async function validateToken(currentToken: string) {
  api.setToken(currentToken);
  const {status} = await api.request('GET', '/users/current');
  return status === 200;
}
