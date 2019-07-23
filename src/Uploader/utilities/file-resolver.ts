import {INormalizedModules, IModule} from 'codesandbox-import-util-types';
import {isText, isTooBig} from 'codesandbox-import-utils/lib/is-text';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import CodeSandboxApi from '../../CodeSandboxApi';
import * as log from '../../log';

interface Files {
  [path: string]: string;
}

export async function resolveModules(
  basePath: string,
  paths: string[],
  api: CodeSandboxApi,
): Promise<INormalizedModules> {
  const modules = {} as INormalizedModules;

  for await (const path of paths) {
    const absolutePath = resolve(basePath, path);
    let content = readFileSync(absolutePath);
    const isBinary = !(await isText(absolutePath, content));

    if (!isBinary) {
      log.info(`Adding ${path}.`);
      modules[path] = {
        content: content.toString(),
        isBinary: false,
      };
      continue;
    }

    if (isTooBig(content)) {
      throw new Error(`${absolutePath} is too big to upload.`);
    }

    log.info(`Uploading binary file ${path}.`);
    const uploadUrl = await api.uploadBinaryFile(path, content);

    modules[path] = {
      content: uploadUrl,
      isBinary: true,
    };
  }

  return modules;
}

export function constructModulesFromFiles(files: Files): INormalizedModules {
  return Object.keys(files).reduce(
    (currentModules, path) => ({
      ...currentModules,
      [path]: {
        content: files[path],
        isBinary: false,
      },
    }),
    {},
  );
}
