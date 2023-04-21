#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { access, cp, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

promisify(async () => {
  const templatesDirectory = resolve(__dirname, '../templates');
  const targetDirectory = process.cwd();

  const templateFiles = await readdir(templatesDirectory);
  await Promise.all(
    templateFiles.map(async (templateFile) => {
      const templateFilePath = resolve(templatesDirectory, templateFile);
      const targetFilePath = resolve(targetDirectory, templateFile);

      try {
        await access(targetFilePath);
        process.stdout.write(
          `"${templateFile}" already exists, overwriting.\n`
        );
        await cp(templateFilePath, targetFilePath);
      } catch {
        await cp(templateFilePath, targetFilePath);
      }
    })
  );

  process.stdout.write('\n');

  spawnSync('rm', ['-rf', 'node_modules']);
  spawnSync('npm', ['init'], { stdio: 'inherit' });
  spawnSync('npm', ['i'], { stdio: 'inherit' });
})();
