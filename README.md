# node-codesandbox

[![NPM Version](https://badge.fury.io/js/node-codesandbox.svg)](https://yarnpkg.com/en/package/node-codesandbox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Upload code to [CodeSandbox](http://codesandbox.io) using [Node](https://nodejs.org).

## How is this different from the [CodeSandbox CLI](https://github.com/codesandbox/cli)?

This is basically the [CodeSandbox CLI](https://github.com/codesandbox/cli) plus the ability to modify what files are being uploaded in a [config object](#usage).

This package can be seen as a proof of concept because if this proves to be something thats useful to people it should likely just be part of the CLI itself. I created it as a seperate package because I needed a quick and easy way to to do this and due to the simplicity of the CodeSandbox API and the way the CLI is currently structured it was faster to do this in a seperate package. And as a bonus it also helped me better understand how the CodeSandbox API works.

## Usage

```ts
import {Uploader, getApiTokenFromUser, logSandboxUrl} from 'node-codesandbox';

(async () => {
  const token = await getApiTokenFromUser();
  const uploader = new Uploader(token);
  const {sandboxUrl} = await uploader.upload(`path/to/folder`, {
    include: ['playground', 'src'], // When defined, the uploader will only upload these files (supports glob patterns)
    exclude: ['**/.DS_Store'], // Files to exclude (supports glob patterns)
    files: {
      'README.md': '# Hello!', // Extra files to include
    },
  });
  logSandboxUrl(sandboxUrl);
})();
```
