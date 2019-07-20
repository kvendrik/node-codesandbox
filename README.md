# [WIP] node-codesandbox

## Isn't this the same as the CodeSandbox CLI?

I created this to create a more flexible way of uploading code to CodeSandbox. This Node package lets you specify what files to include, exclude and add to the upload which allows for very precise and/or custom uploads.

## Shouldn't this be part of the [`codesandbox-importers` monorepo](https://github.com/codesandbox/codesandbox-importers)?

I might look into that once this gets to a more final state, its currently still WIP.

## Usage

```ts
import {Uploader, getApiTokenFromUser, logSandboxUrl} from 'node-codesandbox';

(async () => {
  const token = await getApiTokenFromUser();
  const uploader = new Uploader(token);
  const {sandboxUrl} = await uploader.upload(`path/to/folder`, {
    include: ['playground/'], // When defined, the uploader will only upload these files
    exclude: ['**/.DS_Store'], // Files to exclude
    files: {
      'README.md': '# Hello!', // Extra files to include
    },
  });
  logSandboxUrl(sandboxUrl);
})();
```
