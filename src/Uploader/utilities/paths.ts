import {sync as globSync} from 'glob';
import minimatch from 'minimatch';
import {resolve, relative} from 'path';
import {Config} from '../types';

export function resolveIncludes(basePath: string, includes: Config['include']) {
  if (!includes) {
    return [basePath];
  }
  const finalIncludes = [...includes, 'packages.json'];
  return finalIncludes
    .reduce(
      (currentPaths, relativePath) => [
        ...currentPaths,
        ...globSync(resolve(basePath, relativePath)),
      ],
      [],
    )
    .map((path) => relative(basePath, path));
}

export function filterExcludes(paths: string[], excludes: Config['exclude']) {
  const finalExcludes = [...excludes, 'node_modules', '.git'];
  return paths.filter(
    (path) =>
      !finalExcludes.some((excludePath) => minimatch(path, excludePath)),
  );
}
