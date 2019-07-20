import {INormalizedModules, IModule} from 'codesandbox-import-util-types';
import {readFileSync} from 'fs';
import {resolve} from 'path';

interface Files {
  [path: string]: string;
}

export function resolveFiles(basePath: string, paths: string[]) {
  return paths.reduce(
    (files, path) => ({
      ...files,
      [path]: readFileSync(resolve(basePath, path), 'utf-8'),
    }),
    {},
  );
}

export function constructModulesFromFiles(files: Files): INormalizedModules {
  return Object.keys(files).reduce(
    (currentModules, path) => ({
      ...currentModules,
      [path]: {
        content: files[path],
      } as IModule,
    }),
    ([] as unknown) as INormalizedModules,
  );
}
