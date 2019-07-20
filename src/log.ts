import chalk from 'chalk';

export function instruction(...messages: string[]) {
  console.info(...messages);
}

export function info(...messages: string[]) {
  console.info(...messages.map((message) => chalk.gray(message)));
}

export function success(...messages: string[]) {
  console.info(...messages.map((message) => chalk.green(message)));
}

export function error(...messages: string[]) {
  console.info(...messages.map((message) => chalk.red(message)));
}
