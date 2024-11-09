import fs from 'fs';
import path from 'path';
import { getDependabotPRs } from './get-dependabot-prs';
import { octokitFactory } from './octokitHelper';

jest.mock('@octokit/rest');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

jest.mock('./octokitHelper', () => {
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
      },
    })),
  };
});

describe('get-dependabot-prs', () => {
  it('should get PRs and filter by dependabot[bot] author', async () => {
    const octokit = octokitFactory('token');
    const depes = await getDependabotPRs({
      octokit,
      REPO_OWNER: 'open-ish',
      REPO_NAME: 'utility',
    });

    expect(depes).toEqual([
      {
        html_url: 'url1',
        number: 1,
        title: 'PR 1',
        user: { login: 'dependabot[bot]' },
      },
      {
        html_url: 'url1',
        number: 3,
        title: 'PR 3',
        user: { login: 'dependabot[bot]' },
      },
    ]);
    expect(octokit.pulls.list).toHaveBeenCalledWith({
      owner: 'open-ish',
      repo: 'utility',
      state: 'open',
    });
  });
});
