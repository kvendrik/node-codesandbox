import CodeSandboxApi from '../CodeSandboxApi';
import {getToken, setToken, configPath} from './config';
import inquirer from 'inquirer';
import opn from 'opn';
import ora from 'ora';
import * as log from '../log';

export async function getApiTokenFromUser() {
  const api = new CodeSandboxApi();
  const token = await getToken();

  if (token) {
    return token;
  }

  log.instruction(
    'We will open CodeSandbox and show you an authorization token.',
    '\nPlease paste this token into the CLI to log in.',
  );
  opn('https://codesandbox.io/cli/login', {
    wait: false,
  });

  const {authToken} = await inquirer.prompt([
    {
      message: 'Token:',
      name: 'authToken',
      type: 'input',
    },
  ]);

  const spinner = ora('Verifying token...').start();
  try {
    const {
      data: {
        data: {token, user},
      },
    } = await api.request('GET', `/auth/verify/${authToken}`);
    setToken(token);
    log.success(
      `\nSuccess! Logged in as ${user.username}.`,
      `\nSaved to ${configPath}`,
    );
    spinner.stop();
    return token;
  } catch (error) {
    spinner.stop();
    const message = error.response.data.errors.detail;
    log.error(message.join('\n'));
    process.exit(1);
  }
}
