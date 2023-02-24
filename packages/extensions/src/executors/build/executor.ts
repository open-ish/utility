import { writeFileSync, readFileSync } from 'fs';
import { ExecutorContext } from 'nx/src/config/misc-interfaces';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const pathOutupt = 'packages/' + context.projectName + '/release.config.js';
  const webConfigTemplatePath = __dirname + '/files/release.config__template__';
  const webConfigTemplate = readFileSync(webConfigTemplatePath, 'utf8');

  writeFileSync(
    pathOutupt,
    webConfigTemplate
      .toString()
      .replaceAll('{{PROJECT_NAME}}', context.projectName as string)
  );

  return {
    success: true,
  };
}
