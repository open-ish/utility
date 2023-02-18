import { BuildExecutorSchema } from './schema';
import executor from './executor';
import { readFileSync } from 'fs';

const options: BuildExecutorSchema = {};
const webConfigPath =
  __dirname.split('/packages')[0] + '/packages/trycatchfy/release.config.js';
const context = {
  workspace: {
    projects: {
      access: {
        sourceRoot: 'apps/access',
      },
    },
  },
} as any;
const contextFromTrycatchfy = {
  projectName: 'trycatchfy',
} as any;
describe('Extensions - Executors - semantic-release-exec:release', () => {
  it('Should generate release.config.js file and replace PROJECT_NAME placeholder', async () => {
    const output = await executor(options, contextFromTrycatchfy);
    expect(output.success).toBe(true);

    const webConfigFile = readFileSync(webConfigPath, 'utf8');
    expect(webConfigFile.toString()).toContain(
      contextFromTrycatchfy.projectName
    );
    expect(webConfigFile.toString()).not.toContain('{{PROJECT_NAME}}');
  });
});
