import * as log from './log';
import chalk from 'chalk';

export function logSandboxUrl(url: string) {
  log.success(`Your sandbox url: ${chalk.bold(url)}`);
}
