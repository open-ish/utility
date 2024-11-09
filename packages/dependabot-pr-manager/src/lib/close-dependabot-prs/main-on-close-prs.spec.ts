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

        update: jest.fn().mockResolvedValue({
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

describe('close-dependabot-prs', () => {
  it('should close dependabot PRs', async () => {
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
      ['PR #[PR 1](url1)', 'yellow'],
      ['PR #[PR 3](url1)', 'yellow'],
      ['Closing Dependabot pull requests...', 'blue'],
      ['Closed PR #[PR 1](url1)', 'yellow'],
      ['Closed PR #[PR 3](url1)', 'yellow'],
      ['All Dependabot pull requests have been closed.', 'green'],
    ]);
  });
});
