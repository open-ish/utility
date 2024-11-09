import { Octokit } from '@octokit/rest';
import { consoleHelper } from './consoleHelper';
import { PullRequest } from './types';

interface getDependabotPRs {
  octokit: Octokit;
  REPO_OWNER: string;
  REPO_NAME: string;
}

export async function getDependabotPRs({
  octokit,
  REPO_OWNER,
  REPO_NAME,
}: getDependabotPRs): Promise<PullRequest> {
  consoleHelper(`Fetching open Dependabot pull requests...`, 'blue');
  const { data: pullRequests } = await octokit.pulls.list({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    state: 'open',
  });

  const dependabotPRs = pullRequests.filter(
    (pr) => pr.user && pr.user.login === 'dependabot[bot]',
  );

  return dependabotPRs;
}
