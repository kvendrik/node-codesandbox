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
  const config = readJSONSync(configPath, 'utf-8');
  let token = config.token;
  if (Date.now() - config.lastUpdate > TTL) {
    token = refreshToken(config.token);
  }
  return token;
}

export function setToken(token: string) {
  return writeFileSync(
    configPath,
    JSON.stringify({
      lastUpdate: Date.now(),
      token,
    }),
  );
}

async function refreshToken(currentToken: string) {
  api.setToken(currentToken);
  const newConfig = await api.request('GET', '/users/current');
  const newToken = newConfig.data.token;
  setToken(newToken);
  return newToken;
}
