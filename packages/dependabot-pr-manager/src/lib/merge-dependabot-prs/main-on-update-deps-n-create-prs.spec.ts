import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { main } from './main';
import { consoleHelper } from '../consoleHelper';

jest.mock('@octokit/rest');
jest.mock('child_process');
jest.mock('fs');
jest.mock('path');
jest.mock('./args', () => ({
  argv: {
    repoUrl: 'https://github.com/tassioFront/utility.git',
    combinedBranch: 'ci/combined-branch',
    mainBranch: 'main',
    githubToken: 'token',
    repoOwner: 'open-ish',
    repoName: 'utility',
    installDepsCommand: 'yarn install',
    filesToCommit: 'package.json yarn.lock',
  },
}));
jest.mock('../consoleHelper', () => ({
  consoleHelper: jest.fn(),
}));

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

jest.mock('../octokitHelper', () => {
  return {
    octokitFactory: jest.fn().mockImplementation(() => ({
      pulls: {
        list: jest.fn().mockResolvedValue({
          data: [
            {
              number: 1,
              title: 'PR 1',
              user: { login: 'dependabot[bot]' },
              html_url: 'url1',
            },
            {
              number: 3,
              title: 'PR 3',
              user: { login: 'dependabot[bot]' },
              html_url: 'url1',
            },
            {
              number: 2,
              title: 'PR 2',
              user: { login: 'other-user' },
              html_url: 'url2',
            },
          ],
        }),
        listFiles: jest.fn().mockResolvedValue({
          data: [
            {
              filename: 'package.json',
              patch:
                '-    "dep1": "0.1.0",\n' +
                '+    "dep1": "1.0.0",\n' +
                '     "eslint": "^8.0.1",\n',
            },
            {
              filename: 'package.json',
              patch:
                '-    "dep2": "^12.9.0",\n' +
                '+    "dep2": "^13.15.1",\n' +
                '     "eslint": "^8.0.1",\n',
            },
            {
              filename: 'package.json',
              patch: '-    "dep3": "3.0.0",\n' + '+    "dep3": "3.0.1",\n',
            },
            { filename: 'other-file.txt', patch: '' },
          ],
        }),
        create: jest.fn().mockResolvedValue({
          data: {
            number: 3,
            title: 'PR 3',
            user: { login: 'dependabot[bot]' },
            html_url: 'url3',
          },
        }),
      },
    })),
  };
});

describe('merge-dependabot-prs', () => {
  it('should update dep versions as there are dependabot PRs and create the pull request', async () => {
    const mockPackageJson = {
      dependencies: { dep1: '0.1.0', dep2: '^12.9.0' },
      devDependencies: { dep3: '3.0.0' },
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockPath.resolve.mockReturnValue('package.json');

    await main();

    expect((consoleHelper as jest.Mock).mock.calls).toEqual([
      ['Starting the process...', 'blue'],
      ['Fetching open Dependabot pull requests...', 'blue'],
      ['Found 2 Dependabot pull requests. 🤖', 'green'],
      ['Extracting dependencies from Dependabot pull requests...', 'blue'],
      ['Dependencies extracted successfully.', 'green'],
      ['Updating package.json with new dependencies...', 'blue'],
      ['Updating dep1 to 1.0.0', 'yellow'],
      ['Updating dep2 to ^13.15.1', 'yellow'],
      ['Updating dep3 to 3.0.1', 'yellow'],
      ['package.json updated successfully.', 'green'],
      ['Installing new dependencies...', 'blue'],
      ['Creating new branch', 'blue'],
      ['Committing and pushing changes...', 'blue'],
      ['Creating pull request', 'blue'],
      ['Pull request created: url3', 'green'],
    ]);

    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      'package.json',
      JSON.stringify(
        {
          dependencies: { dep1: '1.0.0', dep2: '^13.15.1' },
          devDependencies: { dep3: '3.0.1' },
        },
        null,
        2,
      ),
    );
    expect(mockExecSync.mock.calls).toEqual([
      ['yarn install'],
      ['git checkout -b ci/combined-branch'],
      ['git add package.json yarn.lock'],
      ['git commit -m "ci: combined dependabot updates" -n'],
      ['git push origin ci/combined-branch'],
    ]);
  });
});
