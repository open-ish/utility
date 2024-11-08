import { main } from './main';
import { consoleHelper } from '../consoleHelper';
import { execSync } from 'child_process';

jest.mock('@octokit/rest');
jest.mock('child_process');
jest.mock('fs');
jest.mock('path');
jest.mock('./args', () => ({
  argv: {
    repoUrl: 'string',
    combinedBranch: 'string',
    mainBranch: 'string',
    githubToken: 'string',
    repoOwner: 'string',
    repoName: 'string',
    installDepsCommand: 'string',
    filesToCommit: 'string',
  },
}));
jest.mock('../consoleHelper', () => ({
  consoleHelper: jest.fn(),
}));

jest.mock('../octokitHelper', () => {
  return {
    octokitFactory: jest.fn().mockImplementation(() => ({
      pulls: {
        list: jest.fn().mockResolvedValue({
          data: [],
        }),
      },
    })),
  };
});

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('merge-dependabot-prs', () => {
  beforeEach(() => {});

  it('should exit and console a exiting message due no dependabot PRs open', async () => {
    await main();

    expect((consoleHelper as jest.Mock).mock.calls).toEqual([
      ['Starting the process...', 'blue'],
      ['Fetching open Dependabot pull requests...', 'blue'],
      ['Found 0 Dependabot pull requests. 🤖', 'green'],
      ['No Dependabot PR to update. Exiting...', 'yellow'],
    ]);

    expect(mockExecSync).not.toHaveBeenCalled();
  });
});
