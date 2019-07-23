import {sync as globSync} from 'glob';
import {statSync} from 'fs';
import minimatch from 'minimatch';
import {resolve, relative} from 'path';
import {Config} from '../types';

export function resolveIncludes(basePath: string, includes: Config['include']) {
  if (!includes) {
    return [basePath];
  }
  const finalIncludes = [...includes, 'package.json'];
  return finalIncludes
    .reduce((currentPaths, relativePath) => {
      const absolutePath = resolve(basePath, relativePath);
      let globMatcher = absolutePath;

      if (!globMatcher.includes('*') && statSync(absolutePath).isDirectory()) {
        globMatcher = `${absolutePath}/**/*`;
      }

      return [
        ...currentPaths,
        ...globSync(globMatcher, {
          nodir: true,
        }),
      ];
    }, [])
    .map((path) => relative(basePath, path));
}

export function filterExcludes(paths: string[], excludes: Config['exclude']) {
  const finalExcludes = [...(excludes || []), 'node_modules', '.git'];
  return paths.filter(
    (path) =>
      !finalExcludes.some((excludePath) => minimatch(path, excludePath)),
  );
}
