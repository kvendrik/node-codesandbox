import {Uploader, getApiTokenFromUser, logSandboxUrl} from '../src';

(async () => {
  const token = await getApiTokenFromUser();
  const uploader = new Uploader(token);
  const {sandboxUrl} = await uploader.upload(`${__dirname}/project`, {
    include: ['package.json', 'App'],
    exclude: ['**/DS_Store'],
    files: {
      'index.tsx': `import * as React from "react";
import { render } from "react-dom";
import App from './App';

const rootElement = document.getElementById("root");
render(<App />, rootElement);`,
    },
  });
  logSandboxUrl(sandboxUrl);
})();
